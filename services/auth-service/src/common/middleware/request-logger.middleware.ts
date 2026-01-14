import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const ms = Date.now() - start;
      const status = res.statusCode;
      const method = req.method;
      const url = req.originalUrl || req.url;
      const length = res.getHeader('content-length') ?? 0;

      this.logger.log(
        `${method} ${url} ${status} - ${ms}ms - ${length}b`,
      );
    });

    next();
  }
}
