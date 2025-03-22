# Spring Application Architecture

In a typical Spring application, the following components are used to organize the codebase into layers, each with a specific responsibility:

## 1. **Models**
   - **Purpose**: Represent the data structure of the application.
   - **Details**:
     - Models are typically Java classes annotated with `@Entity` (for database persistence) or `@Data` (for simple data objects).
     - They map to database tables and define the fields (columns) and relationships.
   - **Example**: A `User` model might have fields like `id`, `name`, and `email`.

   ```java
   @Entity
   public class User {
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
       private Long id;
       private String name;
       private String email;
   }
   ```

## 2. **Repositories**
   - **Purpose**: Handle database operations.
   - **Details**:
     - Repositories are interfaces that extend Spring Data JPA interfaces like `JpaRepository` or `CrudRepository`.
     - They provide methods for CRUD operations (e.g., `save()`, `findById()`, `deleteById()`).
   - **Example**: A `UserRepository` to fetch user data from the database.

   ```java
    public interface UserRepository extends JpaRepository<User, Long> {
        Optional<User> findByEmail(String email);
    }
   ```

## 3. **Services**
   - **Purpose**: Contain business logic and act as an intermediary between controllers and repositories.
   - **Details**:
     - ervices are annotated with `@Service`.
     - They process data, handle transactions, and call repositories to fetch or save data.
   - **Example**: A `UserService` to manage user-related operations.

   ```java
    @Service
    public class UserService {
        private final UserRepository userRepository;

        public UserService(UserRepository userRepository) {
            this.userRepository = userRepository;
        }

        public List<User> getAllUsers() {
            return userRepository.findAll();
        }
    }
   ```

## 4. **Controllers**
   - **Purpose**: Handle HTTP requests and responses.
   - **Details**:
     - Controllers are annotated with `@RestController` or `@Controller`.
     - They define endpoints (e.g., `/users`) and map them to methods using `@RequestMapping` or `@GetMapping`.
   - **Example**: A `UserController` to handle user-related API endpoints.

   ```java
    @RestController
    @RequestMapping("/users")
    public class UserController {
        private final UserService userService;

        public UserController(UserService userService) {
            this.userService = userService;
        }

        @GetMapping
        public List<User> getAllUsers() {
            return userService.getAllUsers();
        }
    }
   ```

## 5. ** DTOs (Data Transfer Objects)**
   - **Purpose**: Simplify data transfer between layers or to/from the client.
   - **Details**:
     - DTOs are plain Java objects (POJOs) that contain only the data needed for a specific operation.
     - They are used to avoid exposing the internal structure of models/entities.
   - **Example**: A `UserDTO` to send user data to the client.

   ```java
        public class UserDTO {
        private String name;
        private String email;

        public UserDTO(String name, String email) {
            this.name = name;
            this.email = email;
        }
    }
   ```

---

## Summary of Responsibilities

| Component | Responsibility |
| --- | --- |
| **Model** | Represents the data structure and maps to database. |
| **Repository** | Handles database operations (CRUD). |
| **Service** | Contains business logic and interacts with repositories. |
| **Controller** | Handles HTTP requests and responses. |
| **DTO** | Transfers data between layers or to/from the client. |