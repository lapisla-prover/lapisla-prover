import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JsonOnlyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const bodyEmpty =
      Object.keys(req.body).length === 0 && req.body.constructor === Object;
    if (!bodyEmpty) {
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        return res.status(415).json({
          message: 'Unsupported Media Type. Only application/json is allowed.',
        });
      }
    }
    next();
  }
}
