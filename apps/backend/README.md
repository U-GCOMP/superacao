# Architecture

This backend follows a **modular, layered architecture**.

Each feature should live in its own module (for example, `auth/`) and organize its code by responsibility.

## Module structure

Each module should be self-contained and expose only what other modules need.

Suggested structure:

```text
src/
	feature-name/
		feature-name.module.ts
		feature-name.controller.ts
		feature-name.service.ts
		feature-name.repository.ts
		models/
			some-operation.model.ts
```

## Why this division exists

Splitting the backend by layers makes responsibilities clear, avoids coupling, and keeps business logic reusable and testable.

Dependency direction should be:

`Controller -> Service -> Repository -> Model (database)`

`Model` objects are used for API input/output contracts.

## Layer responsibilities

### Module

- Groups all files of one feature.
- Registers providers/controllers for NestJS DI.
- Defines the feature boundary.

### Controller

- Receives HTTP requests and returns HTTP responses.
- Validates/parses request header data (using the shared DTOs from the monorepo).
- Delegates business rules to the service.
- Should contain little to no business logic.

Use controller for:

- Route definitions (`@Get`, `@Post`, etc.).
- Request/response mapping.
- Status codes and error translation.

### Service

- Contains business rules and use-case orchestration.
- Coordinates one or more repositories.
- Handles validations that are part of domain behavior.
- Returns data in a form useful for the application layer.

Use service for:

- Business logic execution.
- Decision-making logic.
- Security checks and application rules.

### Repository

- Isolates persistence details (ORM queries, SQL, filters, pagination).
- Provides methods to fetch/save data.
- Should not contain HTTP concerns.

Use repository for:

- Database access.
- Query composition.
- Mapping between persistence rows/documents and model objects.

### Model

- Represents how data is stored in the database.
- Defines persistence schema/columns/relations.
- Is tied to ORM/database concerns.
- It's a humble object. It should NEVER implement business logic methods.

Use model for:

- Database structure.
- Relations and constraints at persistence level.

## How layers should interact

1. Controller receives request and creates/validates a DTO.
2. Service executes business rules using that DTO and models.
3. Service calls repository methods to read/write models.
4. Services receives and returns DTOs, so it's responsible to get models from repository and map them to appropriate DTOs.
5. Controller returns a response to the client.

## Practical rules

- Controllers only read and validate data from the monorepo `shared` directory DTOs
- Keep controllers thin.
- Keep repositories persistence-focused.
- Keep business logic in services only.
- Do not expose models directly in public API responses, always use a DTO.
- Prefer explicit mapping between model and dto when crossing boundaries.
