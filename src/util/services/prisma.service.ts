import { PrismaClient as BasePrismaClient, Prisma } from '@prisma/client'
import { Service } from 'typedi';

@Service()
export class PrismaClient<T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions> extends BasePrismaClient {
    constructor(optionsArg?: Prisma.Subset<T, Prisma.PrismaClientOptions>) {
        super(prismaOptions);
    }
}


const prismaOptions: Prisma.PrismaClientOptions = {
    errorFormat: 'minimal',
    log: ['info', 'warn']
  };
  

