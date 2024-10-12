MySQL Connection Pool Benchmarking in Go
This Go program demonstrates the implementation and benchmarking of a MySQL connection pool compared to a non-pool solution. The benchmarks simulate database operations with varying numbers of concurrent threads, measuring the time taken for both scenarios (with and without a connection pool).

Features
Implements a basic MySQL connection pool with configurable pool size.
Benchmarks MySQL operations with and without a connection pool.
Measures the performance difference between using a pool and not using one under different workloads.
Requirements
Go 1.15+ installed
MySQL server running on your machine (or remotely accessible)
MySQL driver for Go (go-sql-driver/mysql)
Installation
Clone the repository or copy the code:

bash
Copy code
git clone https://github.com/your-username/mysql-connection-pool-benchmark
cd mysql-connection-pool-benchmark
Install Go dependencies:

The program uses the go-sql-driver/mysql MySQL driver. Install it using:

bash
Copy code
go get -u github.com/go-sql-driver/mysql
Set up MySQL:

Make sure you have a running MySQL server and update the connection string (DSN) in the code to match your database configuration.

go
Copy code
const dsn = "root:Root@123@tcp(localhost:3306)/tallycapitaldb"
Update the dsn constant to match your actual MySQL username, password, host, and database name.

Usage
1. Modify the Connection String
Before running the program, ensure you update the dsn constant with your MySQL credentials:

go
Copy code
const dsn = "your-username:your-password@tcp(your-host:your-port)/your-database"
2. Running the Program
To run the program and start the benchmarks:

bash
Copy code
go run main.go
The program will run both non-pool and pool-based benchmarks, printing the time taken for each test case with various thread counts (e.g., 10, 100, 300, 500, 1000).

Example Output
bash
Copy code
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



Explanation
Imports
"database/sql": Provides SQL database access.
"fmt": Used for formatted I/O operations.
"sync": Provides concurrency features like wait groups and mutexes.
"time": Used for benchmarking.
"_ github.com/go-sql-driver/mysql": The MySQL driver is imported for database operations.
Connection Pool Interface and Structure
ConnectionPool interface: Defines three methods that a connection pool must implement: Get(), Put(), and Close().

cpool struct:

Holds a slice of database connections (conns []*sql.DB).
A channel to manage the availability of connections (size-limited channel).
A mutex (mu sync.Mutex) to ensure thread-safe access to the pool.
Database Connection Pool Functions
NewPool(size int)

Creates a new connection pool with a given size.
Initializes a pool by creating size number of connections and adds them to the conns slice.
Adds a signal to the channel to indicate that a connection is available.
Get()

Acquires a connection from the pool.
Waits for availability by consuming from the channel.
Locks the conns slice to safely remove and return the first connection in the slice.
*Put(conn sql.DB)

Returns a connection to the pool.
Locks the conns slice to safely append the connection back.
Signals availability by sending to the channel.
Close()

Closes all database connections and empties the pool.
createNewConnection()

Establishes a new MySQL database connection using the provided Data Source Name (DSN).
Pings the database to ensure the connection is valid.
simulateDatabaseOperation()

Executes a dummy SQL query (SELECT SLEEP(0.01);) to simulate a small database operation.
Benchmark Functions
BenchmarkNonPool(nThreads int)

Simulates database operations without using a connection pool.
For each thread, it creates a new connection, runs the simulateDatabaseOperation(), and closes the connection afterward.
Uses a wait group (sync.WaitGroup) to ensure all threads finish execution before recording the elapsed time.
BenchmarkPool(nThreads int)

Simulates database operations using a connection pool.
Each thread acquires a connection from the pool, runs the simulateDatabaseOperation(), and returns the connection to the pool.
After all operations are complete, the connection pool is closed.
Main Function
Runs the benchmarks for different numbers of threads (10, 100, 300, 500, 1000).
Compares the time taken for database operations with and without a connection pool.
Prints the results for both the non-pool and pool benchmarks.
Key Concepts
Connection Pooling:

A pool of reusable database connections is maintained.
Reusing connections improves performance, especially under heavy load, as creating a new connection is expensive.
Concurrency:

Multiple threads (goroutines) perform database operations simultaneously.
Synchronization mechanisms (sync.WaitGroup, sync.Mutex, sync.Once) are used to handle concurrency safely.
Benchmarking:

Time is measured for each benchmark using time.Now() and time.Since() to calculate the duration of operations.