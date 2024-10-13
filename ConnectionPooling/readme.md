# MySQL Connection Pool Benchmarking in Go

This project provides a Go-based benchmarking tool to compare the performance of MySQL operations with and without a connection pool. It simulates concurrent database access using varying numbers of threads and measures the time taken to complete operations in both scenarios.

## Features

- Implements a basic MySQL connection pool with configurable pool size.
- Benchmarks MySQL operations with and without connection pooling.
- Measures performance differences under different workloads (varied thread counts).

## Requirements

- **Go 1.15+** installed.
- **MySQL server** running locally or remotely accessible.
- **MySQL driver for Go** (`go-sql-driver/mysql`).

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/arpit-ayeeee/SystemPrototypes
    cd SystemPrototypes/ConnectionPooling
    ```

2. **Install Go dependencies:**

    Install the MySQL driver using:

    ```bash
    go get -u github.com/go-sql-driver/mysql
    ```

3. **Set up MySQL:**

    Ensure you have a running MySQL server. Update the connection string (DSN) in the code to match your database configuration:

    ```go
    const dsn = "username:password@tcp(localhost:3306)/dbname"
    ```

## Usage

1. **Modify the Connection String:**

    Update the DSN constant in the code with your actual MySQL credentials:

    ```go
    const dsn = "your-username:your-password@tcp(your-host:your-port)/your-database"
    ```

2. **Running the Program:**

    To run the program and start benchmarking:

    ```bash
    go run main.go
    ```

    The program will run benchmarks for both non-pool and pool-based approaches, printing the time taken for each test with various thread counts (e.g., 10, 100, 300, 500, 1000).

### Example Output

```bash
Starting non-pool benchmarks:
Non-pool time for 10 threads: 150ms
Non-pool time for 100 threads: 1.5s
Non-pool time for 300 threads: 3.8s
...

Starting pool benchmarks:
Pool time for 10 threads: 120ms
Pool time for 100 threads: 1.1s
Pool time for 300 threads: 2.8s
...
```

## Explanation of Key Components

### Imports

- `database/sql`: Provides SQL database access.
- `fmt`: Used for formatted I/O operations.
- `sync`: Provides concurrency features like wait groups and mutexes.
- `time`: Used for benchmarking.
- `_ github.com/go-sql-driver/mysql`: The MySQL driver imported for database operations.

### Connection Pool Structure

- **ConnectionPool Interface:**
  - Defines three methods: `Get()`, `Put()`, and `Close()`.

- **`cpool` Struct:**
  - Holds a slice of database connections (`conns []*sql.DB`).
  - Uses a channel to manage available connections.
  - Uses a mutex (`sync.Mutex`) to ensure thread-safe access.

### Database Connection Pool Functions

- **`NewPool(size int)`**: Creates a new pool with the given size, pre-filling it with database connections.
  
- **`Get()`**: Acquires a connection from the pool, ensuring thread safety and blocking until a connection is available.

- **`Put(conn *sql.DB)`**: Returns a connection to the pool and signals its availability.

- **`Close()`**: Closes all connections in the pool.

- **`createNewConnection()`**: Establishes and validates a new MySQL connection.

- **`simulateDatabaseOperation()`**: Simulates a database operation by executing a dummy SQL query (`SELECT SLEEP(0.01);`).

### Benchmark Functions

- **`BenchmarkNonPool(nThreads int)`**: Simulates operations without a connection pool, creating and closing a new connection for each thread.

- **`BenchmarkPool(nThreads int)`**: Simulates operations with a connection pool, acquiring and returning connections from the pool for each thread.

## Main Function

The main function runs the benchmarks for different numbers of threads (e.g., 10, 100, 300, 500, 1000) and compares the time taken for database operations with and without a connection pool. It prints the benchmark results for each case.

## Key Concepts

- **Connection Pooling**: Reuses database connections, which improves performance under heavy load by reducing the overhead of establishing new connections.
  
- **Concurrency**: Simulates multiple threads (goroutines) performing database operations simultaneously, using synchronization mechanisms (`sync.WaitGroup`, `sync.Mutex`, `sync.Once`) to ensure thread safety.

- **Benchmarking**: Measures the time for each test case using `time.Now()` and `time.Since()`.

---

This README provides a high-level overview of the MySQL connection pool benchmarking tool in Go. Make sure to update the connection strings and dependencies as required before running the benchmarks.
