import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ErrorSwagger } from '../helpers/types.helper';

interface Params {
  response: any;
  hasBearerToken?: boolean;
  tag: 'manager' | 'manager + technician' | 'public';
}

export const SwaggerDocs = ({ response, hasBearerToken, tag }: Params) => {
  return applyDecorators(
    ApiResponse({ status: 200, type: response }),
    ApiResponse({ status: 400, type: ErrorSwagger }),
    ApiResponse({ status: 401, type: ErrorSwagger }),
    ApiResponse({ status: 403, type: ErrorSwagger }),
    ApiResponse({ status: 404, type: ErrorSwagger }),
    ApiResponse({ status: 422, type: ErrorSwagger }),
    ApiResponse({ status: 500, type: ErrorSwagger }),
    ApiTags(tag),
    hasBearerToken
      ? ApiBearerAuth()
      : () => {
          return;
        },
  );
};
