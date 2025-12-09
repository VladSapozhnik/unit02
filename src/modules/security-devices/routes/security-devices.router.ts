import { Router } from 'express';
import { deviceIdParamValidation } from '../validators/deviceId-param.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';
import { SecurityDevicesController } from './security-devices.controller';
import { container } from '../../../composition-root';

const securityDevicesController: SecurityDevicesController = container.get(
  SecurityDevicesController,
);

export const securityDevicesRouter: Router = Router();

securityDevicesRouter.get(
  '/',
  securityDevicesController.getUserDevices.bind(securityDevicesController),
);

securityDevicesRouter.delete(
  '/',
  securityDevicesController.removeOtherSessions.bind(securityDevicesController),
);

securityDevicesRouter.delete(
  '/:deviceId',
  deviceIdParamValidation,
  inputValidationErrorsMiddleware,
  securityDevicesController.removeDeviceSession.bind(securityDevicesController),
);
