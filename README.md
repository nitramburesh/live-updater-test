# Live Updater Test - Zip File Upload Server

A simple HTTP server that allows uploading zip files via curl or any HTTP client.

## Features

- Upload zip files via HTTP POST
- Validation to accept only .zip files
- Maximum file size limit of 100MB
- List all uploaded zip files
- Simple REST API

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

### Start the Server

```bash
npm start
```

The server will start on port 3000 by default (or the port specified in the PORT environment variable).

### Upload a Zip File via curl

```bash
curl -F "file=@path/to/yourfile.zip" http://localhost:3000/upload
```

Example:
```bash
curl -F "file=@myapp_1.0.0.zip" http://localhost:3000/upload
```

### Upload with verbose output

```bash
curl -v -F "file=@yourfile.zip" http://localhost:3000/upload
```

### List All Zip Files

```bash
curl http://localhost:3000/files
```

### Check Server Status

```bash
curl http://localhost:3000/
```

## API Endpoints

### GET /
Health check and API information
- **Response**: JSON with available endpoints

### POST /upload
Upload a zip file
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Parameter**: `file` (the zip file to upload)
- **Response**: JSON with upload details
- **Max file size**: 100MB
- **Storage**: Files are stored in the `uploads/` directory

### GET /files
List all zip files in the uploads directory
- **Method**: GET
- **Response**: JSON with list of zip files

## Response Examples

### Successful Upload
```json
{
  "message": "File uploaded successfully",
  "filename": "myapp_1.0.0.zip",
  "size": 353374,
  "path": "uploads/myapp_1.0.0.zip"
}
```

### Error Response
```json
{
  "error": "Only .zip files are allowed!"
}
```

## Environment Variables

- `PORT`: The port number to run the server on (default: 3000)

Example:
```bash
PORT=8080 npm start
```

## Security Considerations

- Only .zip files are accepted
- File size is limited to 100MB
- Files are validated before being saved
- Filenames are sanitized to prevent path traversal attacks
- Files are stored in a dedicated `uploads/` directory
- Consider adding authentication for production use

## License

MIT
