#!/bin/bash

# File containing list of files and folders to copy
file_list="script/files_to_copy.txt"

echo "Files and folders coping started!"

# Loop through each line in the file
while IFS= read -r line; do
  # Check if line is empty or a comment (starting with #)
  if [[ -z "$line" || $line =~ ^# ]]; then
    continue
  fi

  echo "File: $line"

  # Copy the file/folder specified in the line
  cp -r "$line" ./
done < "$file_list"

echo "Files and folders copied successfully!"
