import { Controller, Get, Param, Query } from '@nestjs/common';
import { RegistryService } from '../api/registry.service';

@Controller('registry')
export class RegistryController {
  constructor(private registryService: RegistryService) {}

  @Get(':snapshotId')
  async getSnapshot(@Param('snapshotId') snapshotId: string) {
    return await this.registryService.getProjectDependencies(snapshotId);
  }
}
