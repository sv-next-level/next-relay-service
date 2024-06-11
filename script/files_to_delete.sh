#!/bin/bash

# File containing list of files and folders to delete
file_list="script/files_to_delete.txt"

echo "Files and folders deleting started!"

# Loop through each line in the file
while IFS= read -r line; do
  # Check if line is empty or a comment (starting with #)
  if [[ -z "$line" || $line =~ ^# ]]; then
    continue
  fi

  echo "File: $line"

  # Delete the file/folder specified in the line
  rm -rf "$line" ./
done < "$file_list"

echo "Files and folders deleted successfully!"
