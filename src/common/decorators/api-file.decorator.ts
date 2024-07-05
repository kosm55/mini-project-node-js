import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export const ApiFile = (
  fileName: string,
  isArray = true,
  isRequired = true,
): MethodDecorator => {
  return applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        required: isRequired ? [fileName] : [],
        properties: {
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

// import { applyDecorators } from '@nestjs/common';
// import { ApiBody } from '@nestjs/swagger';
//
// export const ApiFile = (
//   fileName: string,
//   isArray = true,
//   isRequired = true,
// ): MethodDecorator => {
//   return applyDecorators(
//     ApiBody({
//       schema: {
//         type: 'object',
//         required: isRequired ? [fileName] : [],
//         properties: {
//           ...(isRequired
//             ? {
//                 dto: {
//                   type: 'object',
//                   properties: {
//                     model_id: { type: 'string' },
//                     brand_id: { type: 'string' },
//                     year: { type: 'number' },
//                     price: { type: 'number' },
//                     currency_id: { type: 'string' },
//                     region_id: { type: 'string' },
//                     description: { type: 'string' },
//                     isActive: { type: 'boolean' },
//                   },
//                 },
//               }
//             : {}),
//           [fileName]: isArray
//             ? {
//                 type: 'array',
//                 items: {
//                   type: 'string',
//                   format: 'binary',
//                 },
//               }
//             : {
//                 type: 'string',
//                 format: 'binary',
//               },
//         },
//       },
//     }),
//   );
// };
