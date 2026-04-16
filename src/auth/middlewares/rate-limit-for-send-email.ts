import { Request, Response, NextFunction } from 'express';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { RateLimitData, RateLimitModel } from '../domain/rate.limit.entity';
import { RateLimitRepository } from '../repositories/rate.limit.repositories';
import { add, compareAsc } from 'date-fns';
import { container } from '../../ioc/composition-root';


const rateLimitRepository: RateLimitRepository = container.resolve(RateLimitRepository);

export async function rateLimitForSendEmailMiddleware (req: Request, res: Response, next: NextFunction) {
   const ip = req.ip || 'lol';
      const URL = req.originalUrl;
      const date = add(new Date(), { seconds: 20 });
  
      const limitId = RateLimitModel.createLimitId(ip, URL)
  
      const result = await rateLimitRepository.getLimitsByUrlAndIp(limitId);
  
      if (!result) {
          const rateLimit = RateLimitModel.createRateLimit({
              ip: ip,
              url: URL,
              date: date,
          });
          await rateLimitRepository.createLimitsArray(rateLimit);
          return next();
      }
  
      const listLimits = await rateLimitRepository.updateLastActiveDate(limitId, result.returnFirstRateLimitData());
  
      
      const filter = listLimits?.rateLimits.filter((item: RateLimitData) => compareAsc(item.date, new Date()) > 0) as RateLimitData[];
  
      if (filter.length > 5) {
          return res.sendStatus(HttpResponceCodes.TOO_MANY_REQUESTS_429);
      }
  
      return next();
};
