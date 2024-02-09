import json
import mysql.connector

# MAKE SURE YOU ARE IN THE GET_USER_INFO DIRECTORY
# THEN INSTALL THE CONNECTOR WITH THE COMMAND BELOW
# pip install -t ./ mysql-connector-python

# Database connection parameters
server = "doodal-db.c7qmwgoemetz.us-west-2.rds.amazonaws.com"
username = "admin"
password = "oR4KCGDhAVkdaPWNsZbD"
database = "doodaldb"

# Establishing a connection to the MySQL Server
connection = mysql.connector.connect(
    host=server,
    user=username,
    password=password,
    database=database
)

def get_user_info(event, context):
    try:
        # Creating a cursor object to execute queries
        cursor = connection.cursor()

        # Executing the SELECT query
        select_query = "SELECT email FROM users"
        cursor.execute(select_query)

        # Fetching all rows from the result
        rows = cursor.fetchall()

        # Closing cursor
        cursor.close()

        # Extracting emails from rows
        emails = [row[0] for row in rows]

        # Returning the emails with status code 200
        return {
            'statusCode': 200,
            'body': json.dumps(emails)
        }

    except mysql.connector.Error as error:
        print("Error connecting to MySQL database:", error)
        # Returning an error response with status code 500
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(error)})
        }

# Note: The connection will remain open until the program terminates.
