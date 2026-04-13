import { Request, Response, NextFunction } from 'express';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { RateLimitData } from '../domain/rate.limit.entity';
import { RateLimitRepository } from '../repositories/rate.limit.repositories';
import { add, compareAsc } from 'date-fns';
import { container } from '../../ioc/composition-root';
import { RateLimitModel } from '../domain/rate.limit.entity';


const rateLimitRepository: RateLimitRepository = container.resolve(RateLimitRepository);

export async function rateLimitMiddleware (req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || 'lol';
    const url = req.originalUrl;
    const date = add(new Date(), { seconds: 11 });

    const limitId = RateLimitModel.createLimitId(ip, url);

    const result = await rateLimitRepository.getLimitsByUrlAndIp(limitId);

    if (!result) {
        const rateLimit = RateLimitModel.createRateLimit({
            ip: ip,
            url: url,
            date: date,
        });
 
        await rateLimitRepository.createLimitsArray(rateLimit);
        next();
        return;
    }

    const listLimits = await rateLimitRepository.updateLastActiveDate(limitId, result.returnFirstRateLimitData());

    const filter = listLimits?.rateLimits.filter((item: RateLimitData) => compareAsc(item.date, new Date()) > 0) as RateLimitData[];

    if (filter.length > 5) {
        return res.sendStatus(HttpResponceCodes.TOO_MANY_REQUESTS_429);
    }

    return next();
};
