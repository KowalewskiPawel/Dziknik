import { Request, Response, NextFunction } from "express";

export const bodySanitizer = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Check if the body exists
  if (req.body) {
    // Loop through each key in the request body
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        // Replace potentially harmful content
        // This is a basic example that replaces < and > with their HTML encoded equivalents
        // You can expand on this with more comprehensive sanitization logic
        req.body[key] = req.body[key]
          .toString()
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      }
    }
  }
  next();
};
