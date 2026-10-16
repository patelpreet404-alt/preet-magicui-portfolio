export interface SchemaColumn {
  name: string;
  type: string;
  keys?: readonly ('PK' | 'FK' | 'UQ' | 'IDX' | 'JOIN')[];
  note?: string;
}

export interface SchemaTable {
  id: string;
  name: string;
  description: string;
  columns: readonly SchemaColumn[];
  constraints?: readonly string[];
  totalColumns?: number;
}

export interface SchemaRelation {
  id: string;
  from: string;
  fromColumn: string;
  to: string;
  toColumn: string;
  label: string;
}

export interface ProjectSchema {
  summary: string;
  source: { label: string; href: string };
  tables: readonly SchemaTable[];
  relations: readonly SchemaRelation[];
  notes: readonly string[];
  associationKind?: 'query-joins';
  modelKind?: 'source-data';
}

export const PROJECT_SCHEMAS: Readonly<Record<string, ProjectSchema>> = {
  'ledgerline-credit-risk-scorecard': {
    summary: 'The repository defines four analytical tables. Selected columns are shown here to keep the diagram compact; the linked SQL contains every field and constraint.',
    source: {
      label: 'PostgreSQL-style schema · sql/schema.sql',
      href: 'https://github.com/patelpreet404-alt/credit-risk-scorecard/blob/main/sql/schema.sql'
    },
    tables: [
      {
        id: 'application', name: 'application', description: 'Application-grain inputs, review state, scorecard version, and illustrative risk outputs.', totalColumns: 20,
        columns: [
          { name: 'application_id', type: 'VARCHAR(40)', keys: ['PK'] },
          { name: 'customer_id', type: 'VARCHAR(40)' },
          { name: 'application_date', type: 'DATE', keys: ['IDX'] },
          { name: 'requested_amount', type: 'NUMERIC' },
          { name: 'debt_to_income', type: 'NUMERIC' },
          { name: 'decision_status', type: 'VARCHAR(24)', keys: ['IDX'] },
          { name: 'scorecard_version', type: 'VARCHAR(30)', keys: ['IDX'] },
          { name: 'probability_default', type: 'NUMERIC' }
        ],
        constraints: ['decision_status and scorecard_version participate together in one declared index. The full table has 20 columns; only eight are shown here.']
      },
      {
        id: 'performance_outcome', name: 'performance_outcome', description: 'Matured performance is kept separate from the initial application.',
        columns: [
          { name: 'application_id', type: 'VARCHAR(40)', keys: ['PK', 'FK'], note: 'References application.application_id' },
          { name: 'observation_date', type: 'DATE', keys: ['IDX'] },
          { name: 'default_12m', type: 'SMALLINT' },
          { name: 'days_past_due_max', type: 'SMALLINT' },
          { name: 'exposure_at_default', type: 'NUMERIC' },
          { name: 'loss_given_default', type: 'NUMERIC' }
        ]
      },
      {
        id: 'scorecard_bin', name: 'scorecard_bin', description: 'Versioned WOE and information-value definitions for interpretable scorecard bins.', totalColumns: 9,
        columns: [
          { name: 'scorecard_version', type: 'VARCHAR(30)', keys: ['PK'] },
          { name: 'feature_name', type: 'VARCHAR(100)', keys: ['PK'] },
          { name: 'bin_label', type: 'VARCHAR(120)', keys: ['PK'] },
          { name: 'woe', type: 'NUMERIC' },
          { name: 'information_value', type: 'NUMERIC' },
          { name: 'effective_from', type: 'DATE', keys: ['PK'] }
        ],
        constraints: ['PRIMARY KEY(scorecard_version, feature_name, bin_label, effective_from) is composite; no single field is an individual primary key.']
      },
      {
        id: 'model_validation', name: 'model_validation', description: 'Holdout and monitoring measurements record their sample and whether it is synthetic.', totalColumns: 11,
        columns: [
          { name: 'validation_id', type: 'BIGINT', keys: ['PK'] },
          { name: 'scorecard_version', type: 'VARCHAR(30)' },
          { name: 'validation_date', type: 'DATE' },
          { name: 'sample_rows', type: 'INTEGER' },
          { name: 'roc_auc', type: 'NUMERIC' },
          { name: 'ks_statistic', type: 'NUMERIC' },
          { name: 'dataset_is_synthetic', type: 'BOOLEAN' }
        ]
      }
    ],
    relations: [
      { id: 'performance-application', from: 'performance_outcome', fromColumn: 'application_id', to: 'application', toColumn: 'application_id', label: '1:1 · declared foreign key and primary key' }
    ],
    notes: [
      'Only performance_outcome.application_id has a declared foreign key. Matching scorecard_version values elsewhere are not declared as database relationships.',
      'This SQL schema is a development foundation; the public dashboard shows synthetic and illustrative values rather than reading these tables.',
      'PK, FK, and IDX badges mark participation in declared constraints. Inspect a table for the composite-key or multi-column-index definition.'
    ]
  },
  'fieldnote-commerce-intelligence': {
    summary: 'Query-referenced portion of a nine-table synthetic source. Column names and joins are verified in the supplied SQL; column types and database constraints are not bundled.',
    source: {
      label: 'Category and cohort SQL · repository',
      href: 'https://github.com/patelpreet404-alt/olist-ecommerce-analytics/tree/main/sql'
    },
    associationKind: 'query-joins',
    tables: [
      {
        id: 'customers', name: 'customers', description: 'Customer identifiers and location used by the cohort and delivery analyses.',
        columns: [
          { name: 'customer_id', type: '—', keys: ['JOIN'], note: 'Joined to orders.customer_id in the cohort and delivery queries; no primary or foreign key constraint is supplied.' },
          { name: 'customer_unique_id', type: '—', note: 'Used to group multiple orders into one customer cohort; uniqueness is not declared in the supplied source.' },
          { name: 'customer_state', type: '—' }
        ]
      },
      {
        id: 'orders', name: 'orders', description: 'Order identity, status, progression timestamps, and delivery dates.',
        columns: [
          { name: 'order_id', type: '—', keys: ['JOIN'], note: 'Joined to order_items.order_id in the category query. Delivery metrics remain at order grain.' },
          { name: 'customer_id', type: '—', keys: ['JOIN'], note: 'Joined to customers.customer_id in the cohort and delivery queries.' },
          { name: 'order_status', type: '—' },
          { name: 'order_purchase_timestamp', type: '—' },
          { name: 'order_approved_at', type: '—' },
          { name: 'order_delivered_carrier_date', type: '—' },
          { name: 'order_delivered_customer_date', type: '—' },
          { name: 'order_estimated_delivery_date', type: '—' }
        ]
      },
      {
        id: 'order_items', name: 'order_items', description: 'Product lines and their price and freight amounts. Multiple rows can belong to one order.',
        columns: [
          { name: 'order_id', type: '—', keys: ['JOIN'], note: 'Joined to orders.order_id; multiple item rows may belong to one order.' },
          { name: 'product_id', type: '—', keys: ['JOIN'], note: 'Joined to products.product_id in the category query.' },
          { name: 'price', type: '—' },
          { name: 'freight_value', type: '—' }
        ]
      },
      {
        id: 'products', name: 'products', description: 'Product identifiers and category names used in the category mix query.',
        columns: [
          { name: 'product_id', type: '—', keys: ['JOIN'], note: 'Joined to order_items.product_id in the category query.' },
          { name: 'product_category_name', type: '—', keys: ['JOIN'], note: 'Left joined to category_translation.product_category_name for an optional English label.' }
        ]
      },
      {
        id: 'product_category_name_translation', name: 'category_translation', description: 'Optional English names for product categories, joined by the category name.',
        columns: [
          { name: 'product_category_name', type: '—', keys: ['JOIN'], note: 'Optional LEFT JOIN target; untranslated categories fall back to the original name.' },
          { name: 'product_category_name_english', type: '—' }
        ]
      }
    ],
    relations: [],
    notes: [
      'The snapshot also lists geolocation, order_payments, order_reviews, and sellers. Their field definitions are not supplied by the repository, so they are omitted from this query diagram.',
      'JOIN badges identify fields used in the bundled SQL ON clauses. They do not indicate declared primary or foreign keys; those constraints and column types are not supplied.',
      'Dashed connections are SQL joins, not verified database foreign keys. An em dash means the column type is not specified in the bundled source.',
      'The public page is a static dashboard image. The repository application runs locally from its bundled synthetic analytics snapshot.'
    ]
  },
  'signal-telecom-churn-analytics': {
    modelKind: 'source-data',
    summary: 'Source-defined sample data structures, not database tables. The live dashboard has no migrations, API, persisted subscriber records, or declared relationships.',
    source: {
      label: 'Dashboard sample data · app/page.tsx',
      href: 'https://github.com/patelpreet404-alt/telecom-churn-analytics/blob/main/app/page.tsx'
    },
    tables: [
      {
        id: 'customers', name: 'customers[]', description: 'Five representative customer profiles power search, contract filtering, the detail drawer, and CSV export.', totalColumns: 9,
        columns: [
          { name: 'id', type: 'string', note: 'Display identifier for each sample profile; not a database primary key.' },
          { name: 'plan', type: 'string' },
          { name: 'tenure', type: 'string' },
          { name: 'service', type: 'string' },
          { name: 'monthly', type: 'number' },
          { name: 'risk', type: 'number' },
          { name: 'reason', type: 'string' }
        ]
      },
      {
        id: 'dashboardStats', name: 'dashboardStats', description: 'Seven illustrative headline values displayed in the overview; they are not calculated from the five sample profiles.', totalColumns: 7,
        columns: [
          { name: 'totalSubscribers', type: 'number' },
          { name: 'churnRate', type: 'number' },
          { name: 'churnedSubscribers', type: 'number' },
          { name: 'monthlyRevenueAtRisk', type: 'number' },
          { name: 'monthlyRecurringRevenue', type: 'number' },
          { name: 'estimatedLifetimeValue', type: 'number' },
          { name: 'monthToMonthChurn', type: 'number' }
        ]
      },
      {
        id: 'monthly', name: 'monthly[range]', description: 'Three hardcoded 30-day, 90-day, and 12-month trend series selected by the range control.',
        columns: [
          { name: 'labels', type: 'string[]' },
          { name: 'revenue', type: 'number[]' },
          { name: 'churn', type: 'number[]' }
        ]
      },
      {
        id: 'cohortRows', name: 'cohortRows[]', description: 'Illustrative signup-cohort labels and retention percentages rendered in the cohort view.',
        columns: [
          { name: 'name', type: 'string' },
          { name: 'values', type: 'number[]' }
        ]
      }
    ],
    relations: [],
    notes: [
      'These are JavaScript constants in app/page.tsx. No database schema, primary keys, foreign keys, or SQL joins are defined in the repository.',
      'The dashboardStats, monthly, and cohortRows values are independent illustrative inputs; they are not derived from the five displayed customer profiles.'
    ]
  },
  'ai-learning-management': {
    summary: 'The Drizzle schema separates users, generated course layouts, chapter notes, and study content.',
    source: {
      label: 'Drizzle schema · configs/schema.js',
      href: 'https://github.com/patelpreet404-alt/ai-learning-management-system/blob/main/configs/schema.js'
    },
    tables: [
      {
        id: 'users', name: 'users', description: 'User identity and membership flag.',
        columns: [
          { name: 'id', type: 'serial', keys: ['PK'] },
          { name: 'name', type: 'varchar', note: 'Required' },
          { name: 'email', type: 'varchar', note: 'Required; no unique constraint declared' },
          { name: 'isMember', type: 'boolean', note: 'Default: false' }
        ]
      },
      {
        id: 'studyMaterial', name: 'studyMaterial', description: 'Course request, generated layout, and generation status.',
        columns: [
          { name: 'id', type: 'serial', keys: ['PK'] },
          { name: 'courseId', type: 'varchar', note: 'Required; no foreign key declared' },
          { name: 'courseType', type: 'varchar', note: 'Required' },
          { name: 'topic', type: 'varchar', note: 'Required' },
          { name: 'difficultyLevel', type: 'varchar', note: 'Default: Easy' },
          { name: 'courseLayout', type: 'json' },
          { name: 'createdBy', type: 'varchar', note: 'Required; no foreign key declared' },
          { name: 'status', type: 'varchar', note: 'Default: Generating' }
        ]
      },
      {
        id: 'chapterNotes', name: 'chapterNotes', description: 'Generated notes organized by course and chapter identifiers.',
        columns: [
          { name: 'id', type: 'serial', keys: ['PK'] },
          { name: 'courseId', type: 'varchar', note: 'Required; no foreign key declared' },
          { name: 'chapterId', type: 'integer', note: 'Required' },
          { name: 'notes', type: 'text' }
        ]
      },
      {
        id: 'studyTypeContent', name: 'studyTypeContent', description: 'Generated study content and its type and generation status.',
        columns: [
          { name: 'id', type: 'serial', keys: ['PK'] },
          { name: 'courseId', type: 'varchar', note: 'Required; no foreign key declared' },
          { name: 'content', type: 'json' },
          { name: 'type', type: 'varchar', note: 'Required' },
          { name: 'status', type: 'varchar', note: 'Default: Generating' }
        ]
      }
    ],
    relations: [],
    notes: [
      'These are source-defined tables for the configured application. The public preview presents sample course content.',
      'The source does not declare foreign keys, unique constraints, or secondary indexes. Repeated courseId fields are shown without database-enforced relationship lines.'
    ]
  },
  'researchpaper-ai': {
    summary: 'SQLAlchemy records document ingestion metadata and conversation history; document vectors are stored separately in FAISS.',
    source: {
      label: 'SQLAlchemy models · models_db.py',
      href: 'https://github.com/patelpreet404-alt/researchpaper-ai/blob/main/app/infrastructure/models_db.py'
    },
    tables: [
      {
        id: 'documents', name: 'documents', description: 'Uploaded file location, ingestion progress, and errors.',
        columns: [
          { name: 'id', type: 'String(36)', keys: ['PK'] },
          { name: 'filename', type: 'String(255)', note: 'Required' },
          { name: 'stored_path', type: 'String(500)', note: 'Required' },
          { name: 'status', type: 'String(20)', note: 'Required; default: uploaded' },
          { name: 'page_count', type: 'Integer', note: 'Default: 0' },
          { name: 'chunk_count', type: 'Integer', note: 'Default: 0' },
          { name: 'size_bytes', type: 'Integer', note: 'Default: 0' },
          { name: 'error_message', type: 'Text', note: 'Nullable' },
          { name: 'uploaded_at', type: 'DateTime', note: 'Server default: now' }
        ]
      },
      {
        id: 'conversations', name: 'conversations', description: 'Conversation identity, title, and creation time.',
        columns: [
          { name: 'id', type: 'String(36)', keys: ['PK'] },
          { name: 'title', type: 'String(255)', note: 'Required; default: New conversation' },
          { name: 'created_at', type: 'DateTime', note: 'Server default: now' }
        ],
        constraints: ['The ORM messages relationship uses delete-orphan cascade and orders messages by creation time.']
      },
      {
        id: 'messages', name: 'messages', description: 'Conversation messages and serialized citation information.',
        columns: [
          { name: 'id', type: 'String(36)', keys: ['PK'] },
          { name: 'conversation_id', type: 'String(36)', keys: ['FK'], note: 'References conversations.id; delete cascade' },
          { name: 'role', type: 'String(20)', note: 'Required' },
          { name: 'content', type: 'Text', note: 'Required' },
          { name: 'sources_json', type: 'Text', note: 'Serialized sources; default: []' },
          { name: 'created_at', type: 'DateTime', note: 'Server default: now' }
        ]
      }
    ],
    relations: [
      { id: 'message-conversation', from: 'messages', fromColumn: 'conversation_id', to: 'conversations', toColumn: 'id', label: 'N:1 · delete cascade' }
    ],
    notes: [
      'The public preview uses a prepared sample. Live uploads and model calls require the configured application.',
      'Citation references live in sources_json; the source declares no document-to-message foreign key. FAISS vectors are outside this relational schema.'
    ]
  },
  foodfolk: {
    summary: 'The SQLite backend models people, sessions, friendships, restaurants, reviews, photos, and saved places.',
    source: {
      label: 'SQLite schema · server/schema.sql',
      href: 'https://github.com/patelpreet404-alt/foodfolk-discovery-map/blob/main/server/schema.sql'
    },
    tables: [
      {
        id: 'users', name: 'users', description: 'Account records and discovery and visibility preferences.',
        columns: [
          { name: 'id', type: 'TEXT', keys: ['PK'] },
          { name: 'name', type: 'TEXT', note: 'Required' },
          { name: 'username', type: 'TEXT', keys: ['UQ'], note: 'Required; unique' },
          { name: 'password', type: 'TEXT', note: 'Required' },
          { name: 'discoverable', type: 'INTEGER', note: 'Required; default: 1' },
          { name: 'default_visibility', type: 'TEXT', note: 'Required; default: friends' },
          { name: 'created_at', type: 'TEXT', note: 'Required' }
        ]
      },
      {
        id: 'sessions', name: 'sessions', description: 'Session tokens and expiry associated with accounts.',
        columns: [
          { name: 'token', type: 'TEXT', keys: ['PK'] },
          { name: 'user_id', type: 'TEXT', keys: ['FK'], note: 'Required; references users.id; delete cascade' },
          { name: 'expires', type: 'INTEGER', note: 'Required' }
        ]
      },
      {
        id: 'friendships', name: 'friendships', description: 'Friend requests with a unique pair identifier.',
        columns: [
          { name: 'id', type: 'TEXT', keys: ['PK'] },
          { name: 'sender', type: 'TEXT', keys: ['FK'], note: 'Required; references users.id' },
          { name: 'recipient', type: 'TEXT', keys: ['FK'], note: 'Required; references users.id' },
          { name: 'status', type: 'TEXT', note: 'Required; pending or accepted' },
          { name: 'pair', type: 'TEXT', keys: ['UQ'], note: 'Required; unique' },
          { name: 'created_at', type: 'TEXT', note: 'Required' }
        ],
        constraints: ["status must be 'pending' or 'accepted'."]
      },
      {
        id: 'restaurants', name: 'restaurants', description: 'Place details, coordinates, and source attribution.',
        columns: [
          { name: 'id', type: 'TEXT', keys: ['PK'] },
          { name: 'name', type: 'TEXT', note: 'Required' },
          { name: 'cuisine', type: 'TEXT', note: 'Required' },
          { name: 'address', type: 'TEXT', note: 'Required' },
          { name: 'lat', type: 'REAL', keys: ['IDX'], note: 'Required; part of composite restaurant_bounds(lat, lng)' },
          { name: 'lng', type: 'REAL', keys: ['IDX'], note: 'Required; part of composite restaurant_bounds(lat, lng)' },
          { name: 'source', type: 'TEXT', note: 'Required' },
          { name: 'source_url', type: 'TEXT', note: 'Required' },
          { name: 'normalized', type: 'TEXT', keys: ['UQ'], note: 'Required; unique' }
        ],
        constraints: ['restaurant_bounds is one composite index on (lat, lng).']
      },
      {
        id: 'reviews', name: 'reviews', description: 'A person’s restaurant review with rating and visibility.',
        columns: [
          { name: 'id', type: 'TEXT', keys: ['PK'] },
          { name: 'user_id', type: 'TEXT', keys: ['FK', 'UQ'], note: 'Required; references users.id; part of composite UNIQUE(user_id, restaurant_id)' },
          { name: 'restaurant_id', type: 'TEXT', keys: ['FK', 'UQ', 'IDX'], note: 'Required; references restaurants.id; part of composite unique pair; review_place index' },
          { name: 'rating', type: 'INTEGER', note: 'Required; between 1 and 5' },
          { name: 'body', type: 'TEXT', note: 'Required' },
          { name: 'dishes', type: 'TEXT', note: 'Required' },
          { name: 'price', type: 'TEXT', note: 'Nullable' },
          { name: 'visibility', type: 'TEXT', note: 'Required; public, friends, or private' },
          { name: 'created_at', type: 'TEXT', note: 'Required' }
        ],
        constraints: [
          'UNIQUE(user_id, restaurant_id) permits one review per person and restaurant; neither field is individually unique.',
          'review_place indexes restaurant_id.',
          'rating is between 1 and 5; visibility is public, friends, or private.'
        ]
      },
      {
        id: 'photos', name: 'photos', description: 'Photo records associated with a person and optionally a review.',
        columns: [
          { name: 'id', type: 'TEXT', keys: ['PK'] },
          { name: 'user_id', type: 'TEXT', keys: ['FK'], note: 'Required; references users.id' },
          { name: 'review_id', type: 'TEXT', keys: ['FK'], note: 'Nullable; references reviews.id' },
          { name: 'created_at', type: 'TEXT', note: 'Required' }
        ]
      },
      {
        id: 'saved', name: 'saved', description: 'Saved restaurants joined to people through a composite key.',
        columns: [
          { name: 'user_id', type: 'TEXT', keys: ['PK', 'FK'], note: 'Required; references users.id; part of composite primary key' },
          { name: 'restaurant_id', type: 'TEXT', keys: ['PK', 'FK'], note: 'Required; references restaurants.id; part of composite primary key' }
        ],
        constraints: ['PRIMARY KEY(user_id, restaurant_id) identifies the saved pair; neither field is an individual primary key.']
      }
    ],
    relations: [
      { id: 'session-user', from: 'sessions', fromColumn: 'user_id', to: 'users', toColumn: 'id', label: 'N:1 · delete cascade' },
      { id: 'friend-sender', from: 'friendships', fromColumn: 'sender', to: 'users', toColumn: 'id', label: 'N:1 · sender' },
      { id: 'friend-recipient', from: 'friendships', fromColumn: 'recipient', to: 'users', toColumn: 'id', label: 'N:1 · recipient' },
      { id: 'review-user', from: 'reviews', fromColumn: 'user_id', to: 'users', toColumn: 'id', label: 'N:1 · author' },
      { id: 'review-place', from: 'reviews', fromColumn: 'restaurant_id', to: 'restaurants', toColumn: 'id', label: 'N:1 · reviewed place' },
      { id: 'photo-user', from: 'photos', fromColumn: 'user_id', to: 'users', toColumn: 'id', label: 'N:1 · owner' },
      { id: 'photo-review', from: 'photos', fromColumn: 'review_id', to: 'reviews', toColumn: 'id', label: 'N:1 · optional review' },
      { id: 'saved-user', from: 'saved', fromColumn: 'user_id', to: 'users', toColumn: 'id', label: 'N:1 · saved by' },
      { id: 'saved-place', from: 'saved', fromColumn: 'restaurant_id', to: 'restaurants', toColumn: 'id', label: 'N:1 · saved place' }
    ],
    notes: [
      'This schema belongs to the persistent Node/SQLite backend. The deployed Food Map preview uses seeded and browser-local data.',
      'The source enables SQLite foreign keys and WAL. Composite PK, UQ, and IDX badges mark participation in a shared constraint; inspect a table for its exact definition.'
    ]
  }
};
