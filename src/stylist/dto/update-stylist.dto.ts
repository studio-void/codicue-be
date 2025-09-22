import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateStylistDto } from './create-stylist.dto';

export class UpdateStylistDto extends PartialType(
  OmitType(CreateStylistDto, ['email']),
) {}
