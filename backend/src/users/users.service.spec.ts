import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: {
    create: jest.Mock;
    findByIdAndDelete: jest.Mock;
  }

  beforeEach(async () => {
    mockUserModel = {
      create: jest.fn(),
      findByIdAndDelete: jest.fn()
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // Teste de criação de usuario
  it('Deve criar um usuario e retornar status 201', async () => {
    const dto = {
      name: 'jonnathas',
      email: 'jonnathas@example.com',
      password: 'senha12345'
    };

    const hashed_password = 'senha_hash'
    const fakeUser = {
      _id: 'fakeObjectId123',
      name: dto.name,
      email: dto.email,
      password: hashed_password
    };

    jest.spyOn(service, 'hashPassword').mockResolvedValue(hashed_password);

    mockUserModel.create.mockResolvedValue(fakeUser);

    const result = await service.createUser(dto);

    expect(service.hashPassword).toHaveBeenCalledWith(dto.password);
    expect(mockUserModel.create).toHaveBeenCalledWith({
      name: dto.name,
      email: dto.email,
      password: hashed_password
    });

    expect(result).toEqual(fakeUser);

  })


  //Teste de exclusão de usuario
  it('Deve excluir um usuario e retornar status 200', async () => {
    const userId = 'fakeObjectId123';

    mockUserModel.findByIdAndDelete.mockResolvedValue(null);

    await service.deleteUserById(userId);

    expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId)
  })


});
