import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export const ApiFile = (
  fileName: string,
  isArray = true,
  isRequired = true,
): MethodDecorator => {
  const requiredFields = [
    'model_id',
    'brand_id',
    'region_id',
    'year',
    'price',
    'currency_id',
    'description',
  ];

  if (isRequired) {
    requiredFields.push(fileName);
  }
  return applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        required: requiredFields,
        properties: {
          model_id: { type: 'string', format: 'uuid' },
          brand_id: { type: 'string', format: 'uuid' },
          year: { type: 'number' },
          price: { type: 'number' },
          currency_id: { type: 'string', format: 'uuid' },
          region_id: { type: 'string', format: 'uuid' },
          description: { type: 'string' },
          [fileName]: isArray
            ? {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'binary',
                },
              }
            : {
                type: 'string',
                format: 'binary',
              },
        },
      },
    }),
  );
};
