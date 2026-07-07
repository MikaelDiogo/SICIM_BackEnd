import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { DomainError, DomainErrorType } from '../../domain/exceptions/domain.error';

const STATUS_BY_TYPE: Record<DomainErrorType, HttpStatus> = {
  [DomainErrorType.VALIDATION]: HttpStatus.BAD_REQUEST,
  [DomainErrorType.CONFLICT]: HttpStatus.CONFLICT,
  [DomainErrorType.NOT_FOUND]: HttpStatus.NOT_FOUND,
};

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = STATUS_BY_TYPE[exception.type] ?? HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }
}
