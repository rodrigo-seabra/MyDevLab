## AGENTS.md

MyDevLab is a Laravel application.

The current technical baseline is:

* PHP 8.4;
* Laravel as the application framework;
* Apache as the web server;
* PostgreSQL 17 as the primary database;
* Docker Compose for local development;
* Composer for PHP dependency management;
* `public/` as the web document root;
* `public/index.php` as the HTTP entry point;
* Blade as the default server-rendered view layer;
* Git and GitHub for version control.

The application should remain primarily server-rendered unless a current requirement clearly justifies a different frontend architecture.

Always inspect the repository before referring to application structures that have not been verified.


---

## Laravel architecture

Laravel is the application framework for MyDevLab.

Follow Laravel conventions unless the repository explicitly establishes a different convention.

Prefer framework-native functionality before introducing custom abstractions or third-party packages.

Use Laravel conventions for:

* routing;
* controllers;
* request validation;
* middleware;
* configuration;
* dependency resolution;
* database migrations;
* database transactions;
* Blade views;
* logging;
* console commands;
* automated testing.

Use Composer for PHP dependencies.

Use Artisan commands where appropriate.

Database schema changes must use Laravel migrations unless the repository explicitly establishes another mechanism.

Use Blade for server-rendered HTML.

Blade's escaped output syntax should be preferred for dynamic content:

```blade
{{ $value }}
```

Only render unescaped HTML when the content is explicitly trusted and the reason is clear.

Prefer Laravel validation mechanisms for request data.

Prefer Eloquent or Laravel's query builder for application database access.

Raw SQL is acceptable when it provides a clear technical benefit, but values must remain parameterized and the reason for bypassing the framework abstraction should be understandable.

---

## Application structure

Follow Laravel's standard directory conventions where practical.

Typical responsibilities include:

```text
app/
    Http/
    Models/

bootstrap/

config/

database/
    factories/
    migrations/
    seeders/

public/

resources/
    css/
    js/
    views/

routes/

storage/

tests/
```

Do not create additional architectural layers merely to make the project appear more sophisticated.

Controllers should remain focused on HTTP/application orchestration.

Models should represent application data and related behavior where appropriate.

When business logic grows beyond a reasonable controller or model responsibility, extract it into focused application classes.

Do not create generic:

* service layers;
* repository layers;
* DTO hierarchies;
* interfaces;
* factories;
* domain layers;

unless an actual requirement or growing complexity justifies them.

---

## Frontend conventions

MyDevLab is primarily a Laravel server-rendered application.

The default frontend approach is:

```text
Blade
CSS
minimal JavaScript
```

Do not introduce React, Vue, Angular, Inertia, Livewire, Alpine, or another frontend framework/library solely because it may be useful later.

A frontend dependency should solve a concrete current requirement.

Prefer progressive enhancement over replacing server-rendered behavior with client-side application logic.

Keep JavaScript scoped to interactions that genuinely require browser-side behavior.

Preserve accessibility basics:

* semantic HTML;
* appropriate heading structure;
* form labels;
* keyboard accessibility;
* useful alternative text;
* visible focus states;
* meaningful error messages.

---

## Database conventions

PostgreSQL is the source of truth for persistent application data.

Use Laravel migrations for schema changes.

Migrations must be reproducible and committed with the code that depends on them.

Use:

* primary keys;
* foreign keys;
* unique constraints;
* nullability rules;
* indexes;

when they represent actual application integrity or query requirements.

Avoid speculative indexes.

Use Eloquent relationships when they clearly represent relationships in the data model.

Use Laravel database transactions for operations that must succeed or fail atomically.

Seed/demo data belongs in Laravel seeders or factories and must not contain real customer, production, or private data.

Never embed database credentials in:

* PHP source;
* migrations;
* seeders;
* Dockerfiles;
* committed Docker Compose configuration.

---

## Validation expectations

Choose checks proportional to the change.

For PHP and Laravel changes, relevant checks may include:

```bash
php artisan test
php artisan route:list
php artisan migrate:status
```

For changed standalone PHP files, `php -l` may also be used where useful.

For migration changes, validate them against the development PostgreSQL database when available.

For Docker changes:

```bash
docker compose config
```

and when practical:

```bash
docker compose up -d --build
docker compose ps
```

For user-facing Laravel changes, verify the affected route or page when possible.

Check:

* successful rendering;
* expected validation;
* escaped output;
* failure behavior;
* basic accessibility.

Always inspect:

```bash
git diff
git status
```

before reporting completion.
