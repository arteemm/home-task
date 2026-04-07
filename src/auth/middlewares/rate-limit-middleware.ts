import { Request, Response, NextFunction } from 'express';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { RateLimitData, RateLimit } from '../domain/rate.limit.entity';
import { RateLimitRepository } from '../repositories/rate.limit.repositories';
import { add, compareAsc } from 'date-fns';
import { container } from '../../ioc/composition-root';
import { RateLimitModel } from '../infrastructure/mongoose/rate.limit.shema';


const rateLimitRepository: RateLimitRepository = container.resolve(RateLimitRepository);

export async function rateLimitMiddleware (req: Request, res: Response, next: NextFunction) {
    const rateLimitInstance: RateLimit = RateLimit.create({
        ip: req.ip || 'lol',
        URL: req.originalUrl,
        date: add(new Date(), {
                seconds: 11
            
             }),
    });

    const result = await rateLimitRepository.getLimitsByUrlAndIp(rateLimitInstance.limitId);

    if (!result) {
        const rateLimit = new RateLimitModel(rateLimitInstance);
        await rateLimitRepository.createLimitsArray(rateLimit);
        return next();
    }

    const listLimits = await rateLimitRepository.updateLastActiveDate(rateLimitInstance.limitId, rateLimitInstance.returnFirstRateLimitData());

    
    const filter = listLimits?.rateLimits.filter((item: RateLimitData) => compareAsc(item.date, new Date()) > 0) as RateLimitData[];

    if (filter.length > 5) {
        return res.sendStatus(HttpResponceCodes.TOO_MANY_REQUESTS_429);
    }

    return next();
};
