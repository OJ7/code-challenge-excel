## Instructions for running solution

1. Extract `data.sql` file from `data.sql.gz`

1. Start mysql server (run `mysql.server start`)
    ```
    > mysql.server.start
    Starting MySQL
    .. SUCCESS!
    ```

1. Open mysql shell (run `mysql -u root -p`) and enter password
    ```
    > mysql -u root -p
    Enter password:
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 9
    Server version: 8.0.23 Homebrew

    Copyright (c) 2000, 2021, Oracle and/or its affiliates.

    Oracle is a registered trademark of Oracle Corporation and/or its
    affiliates. Other names may be trademarks of their respective
    owners.

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

    mysql>
    ```
1. Create `whitebox` database (run `CREATE DATABASE whitebox;`) and switch to the database (run `use whitebox;`)
    ```
    mysql> CREATE DATABASE whitebox;
    Query OK, 1 row affected (0.01 sec)

    mysql> use whitebox;
    Database changed
    ```
1. Exit mysql shell

1. Import data into `whitebox` database (run `mysql -u root -p whitebox < data.sql`)

1. Update connection details as needed in `index.js` file
    ```
    const connection = mysql.createConnection({
        // replace connection details as needed
        host: 'localhost',
        user: 'root',
        password: 'Whitebox12345!',
        database: 'whitebox',
    });
    ```

1. Run `npm start`
    ```
    > npm start

    > code-challenge-excel@1.0.0 start path/to/code-challenge-excel
    > node index

    Connected to database!
    Querying database...
    Closed the database connection.
    File saved! View at ./output.xlsx
    ```

1. View results in `output.xlsx` file


## Whitebox Code Challenge

Write a NodeJS Script that reads data from a SQL Database of your choice, filters that data to only include the data for one specific client, and converts that data into a multi-tabbed Excel spreadsheet (sample-output.xlsx).

 - The `data.sql.gz` files in this repository contains the SQL data to use.
 - You will need to install a SQL Database of SQL Database docker container.
 - You will need to import/run the `data.sql.gz` contents to populate the SQL into your database.
 - You will need to write a NodeJS script to
   - Access the database,
   - Read its contents,
   - Filter it,
   - and Produce the the final results.
 - There is more than one client's data in this SQL file.
 - You should only include data from one client, the client with `ID = 1240`.
 - You *are* allowed to use libraries for this challenge.
 - The final output should match the structure of the `sample-output.xlsx` file. (*Please note that the actual content of the sample-output.xlsx may not match the data given in the data.sql.gz file.*)

 - **We estimate this task should take about 2 hours, depending on your skill level with the technologies involved. If time is too tight of a constraint, please tell us about what you were planning to do given more time.**

### Submitting the code challenge

Please create a GitHub Repo with your final result. I should be able to run your script and produce the required output.

### Helpful Hints

- You can install Mysql in Docker https://hub.docker.com/_/mysql
- You can also install Mysql on MacOS using https://formulae.brew.sh/formula/mysql
- You can also install Mysql on Windows https://dev.mysql.com/downloads/installer/
- If you don't have excel, you can test your output using Google Sheets
