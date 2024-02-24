def clean_prompt(prompt):
  if not prompt.isalpha():
    return {
      "statusCode": 400,
      "body": "Error: Prompt should contain only alphabetical characters."
    }
  else:
    return {
      "statusCode": 200,
      "body": "Prompt is valid."
    }

prompt = input("Enter a prompt: ")
response = clean_prompt(prompt)
print(response)
