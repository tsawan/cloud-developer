import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port: String = process.env.PORT || '8082';

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("should try GET /filteredimage?image_url={{}}")
  });

  // filteredImage Endpoint
  // run the image filter and return the new image.
  app.get("/filteredImage/", async (req: Request, res: Response) => {
    let { image_url } = req.query;

    // validate the query param.
    if (!image_url) {
      return res.status(422).send(`Image url is missing`);
    }

    // runs the image filter
    filterImageFromURL(image_url).then(file_path => {
      return res
        .status(200)
        // remove the temp file after response is sent
        .on('finish', () => {
          deleteLocalFiles([file_path]);
        })
        .sendFile(file_path)
    }, err => {
      console.log(err.message)
      return res.status(404).send("Invalid image url");
    });

  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();