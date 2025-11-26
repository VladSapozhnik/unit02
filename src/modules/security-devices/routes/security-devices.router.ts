import { Router } from 'express';
import { getUserDevicesHandler } from './handlers/get-user-devices.handler';
import { removeDeviceSessionHandler } from './handlers/remove-device-session.handler';
import { removeOtherSessionsHandler } from './handlers/remove-other-sessions.handler';
import { deviceIdParamValidation } from '../validators/deviceId-param.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';

export const securityDevicesRouter: Router = Router();

securityDevicesRouter.get('/', getUserDevicesHandler);

securityDevicesRouter.delete('/', removeOtherSessionsHandler);

securityDevicesRouter.delete(
  '/:deviceId',
  deviceIdParamValidation,
  inputValidationErrorsMiddleware,
  removeDeviceSessionHandler,
);
