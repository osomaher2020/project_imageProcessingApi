# project_imageProcessingApi
This project uses Node.js + express as a server, with 2 endpoints
  - GET: http://localhost:3000/api/resize?width=[number]&height=[number]&img=[image_name] which can be accessed from a browser URL, immediately shows the resized image
  - POST: http://localhost:3000/api/resize which can be accessed via GUI on "front-end/index.html", just choose an image with .jpg extension, define its height and width and your resized image will be ready

  # Getting the server ready:
    - npm install
    - npm run start
  
  # Testing: uses jasmine tesing & supertest dependinces
    - npm run test
  
  # Test specs
    - "express server response 200": checks endPoint "/" to verify that Express server is running
    - "image file is found": checks if the imageFile to be tested is found at /images
    - "is test-image uploaded": checks endPoint /api/resize by uploading a test image with specified height & width, checks for a success response 200 then tears down the  testImage from /uploads

  # GET Response cases:
    - if image uploaded & resized Successfully : returns a status 200 & the resized image File
    - if selected image is pre-existed: returns a status 200 & the cached image File
    - if selected image doesn't has .jpg extension: returns an error of status 415 with { message: "Use only .jpg" }

# POST Response cases:
    - if image uploaded & resized Successfully : returns a status 200 with { message: "Uploaded Successfully", img_path: "its path on the server" }
    - if selected image is pre-existed: returns a status 200 with { message: "Image Existed !", img_path: "its path on the server" }
    - if selected image doesn't has .jpg extension: returns an error of status 415 with { message: "Use only .jpg" }
    - if no image selected: returns an error of status 400 with { message: "no image selected" }
    - if image size > 4MB : returns an error of status 413 with { message: "max size = 4 MB" }
