import { Request, Response, NextFunction } from 'express';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { RateLimitData } from '../../auth/types/rate-limt-data';
import { rateLimitRepository } from '../repositories/rate.limit.repositories';
import { add, compareAsc } from 'date-fns';


export async function rateLimitMiddleware (req: Request, res: Response, next: NextFunction) {
    const sessionDto: RateLimitData =  {
        ip: req.ip || 'lol',
        URL: req.originalUrl,
        date: new Date(),
    };

    const limitId = Buffer.from(sessionDto.ip + sessionDto.URL).toString('base64');

    const result = await rateLimitRepository.getLimitsByUrlAndIp(limitId);

    if (!result) {
        await rateLimitRepository.createLimitsArray(limitId, sessionDto);
        return next();
    }

    const listLimits = await rateLimitRepository.updateLastActiveDate(limitId, sessionDto);

    const comparisonDate = add(new Date(), {
                seconds: -16.6
            
             });
    
    const filter = listLimits?.rateLimits.filter((item: RateLimitData) => compareAsc(item.date, comparisonDate) > 0) as RateLimitData[];

    if (filter.length > 5) {
        return res.sendStatus(HttpResponceCodes.TOO_MANY_REQUESTS_429);
    }

    return next();
};
