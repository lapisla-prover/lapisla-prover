import { Controller, Get, Param, Query } from '@nestjs/common';
import { RegistryService } from '../generated/openapi';

@Controller('registry')
export class RegistryController {
    constructor(private registryService: RegistryService) {}

    @Get(":snapshotId")
    getSnapshot(@Param("snapshotId") snapshotId: string) {
        return this.registryService.getProjectDependencies(snapshotId);
    }
}
