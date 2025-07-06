import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateUserDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { USER } from 'src/utils/common';
import { IUser } from './users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private nguoiDungRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const {
      TaiKhoan,
      MatKhau,
      Email,
      HoTen,
      NgaySinh,
      GioiTinh,
      DiaChi,
      SoDienThoai,
      AnhDaiDien,
      VaiTro,
    } = createUserDto;

    const isExist = await this.nguoiDungRepository.findOne({
      where: { Email },
    });
    if (isExist) {
      throw new BadRequestException(
        `Email: ${Email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`,
      );
    }

    const hashPassword = this.getHashPassword(MatKhau);

    const newUser = this.nguoiDungRepository.create({
      TaiKhoan,
      MatKhau: hashPassword,
      Email,
      HoTen,
      NgaySinh,
      GioiTinh,
      DiaChi,
      SoDienThoai,
      AnhDaiDien,
      VaiTro,
    });

    await this.nguoiDungRepository.save(newUser);
  }

  async findAllExcluding(userId: number): Promise<IUser[]> {
    return this.nguoiDungRepository
      .createQueryBuilder('user')
      .select([
        'user.MaNguoiDung AS MaNguoiDung',
        'user.TaiKhoan AS TaiKhoan',
        'user.Email AS Email',
        'user.HoTen AS HoTen',
        'user.DiaChi AS DiaChi',
        'user.SoDienThoai AS SoDienThoai',
        'user.AnhDaiDien AS AnhDaiDien',
        'user.VaiTro AS VaiTro',
      ])
      .where('user.MaNguoiDung != :userId', { userId })
      .getRawMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async findOneByUsername(Email: string): Promise<User | null> {
    return await this.nguoiDungRepository
      .createQueryBuilder('user')
      .where('user.Email = :Email', { Email: Email })
      .getOne();
  }

  isValidPassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }

  async resendCode(body: { MaNguoiDung: number }) {
    const user = await this.nguoiDungRepository.findOne({
      where: {
        MaNguoiDung: body.MaNguoiDung,
      },
    });

    console.log(user);

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    if (user?.isActive === 1) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    const codeId = uuidv4();

    await this.nguoiDungRepository.update(
      { MaNguoiDung: user?.MaNguoiDung },
      {
        codeId: codeId,
        codeExpired: dayjs().add(5, 'minute').toDate(),
      },
    );

    this.mailerService.sendMail({
      to: user.Email,
      subject: 'Activate your account',
      template: 'register',
      context: {
        name: user?.HoTen ?? user?.Email,
        activationCode: codeId,
      },
    });
    return true;
  }

  async handleRegister(registerDTO: CreateUserDto) {
    const {
      TaiKhoan,
      MatKhau,
      Email,
      HoTen,
      GioiTinh,
      DiaChi,
      SoDienThoai,
      AnhDaiDien,
      VaiTro,
    } = registerDTO;

    // Kiểm tra email đã tồn tại
    const isExist = await this.nguoiDungRepository.findOne({
      where: { Email },
    });

    if (isExist) {
      throw new BadRequestException(
        `Email: ${Email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`,
      );
    }

    const hashPassword = this.getHashPassword(MatKhau);
    const codeId = uuidv4();
    const codeExpired = dayjs().add(5, 'minute').toDate();
    const NgaySinh = dayjs().toDate();
    const isActive = 0;

    const newUser = this.nguoiDungRepository.create({
      TaiKhoan,
      MatKhau: hashPassword,
      Email,
      HoTen,
      NgaySinh,
      GioiTinh: GioiTinh ?? 'Nam',
      DiaChi: DiaChi ?? 'Thai Binh',
      SoDienThoai: SoDienThoai ?? '0123456789',
      AnhDaiDien: AnhDaiDien ?? 'avatar.png',
      VaiTro: VaiTro ?? USER,
      isActive,
      codeId,
      codeExpired,
    });

    await this.nguoiDungRepository.save(newUser);

    this.mailerService.sendMail({
      to: newUser.Email,
      subject: 'Activate your account',
      template: 'register',
      context: {
        name: newUser?.HoTen ?? newUser?.Email,
        activationCode: codeId,
      },
    });

    return {
      id: newUser.MaNguoiDung,
    };
  }

  async handleActive(data: CodeAuthDto) {
    const user = await this.nguoiDungRepository.findOne({
      where: {
        MaNguoiDung: data?.MaNguoiDung,
        codeId: data?.code,
      },
    });

    if (!user) {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn ');
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(dayjs(user.codeExpired));

    if (isBeforeCheck) {
      await this.nguoiDungRepository.update(
        { MaNguoiDung: data.MaNguoiDung },
        { isActive: 1 },
      );
      return { isBeforeCheck };
    } else {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn ');
    }
  }

  async retryActive(email: string) {
    const user = await this.nguoiDungRepository.findOne({
      where: {
        Email: email,
      },
    });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    if (user?.isActive === 1) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    const codeId = uuidv4();

    await this.nguoiDungRepository.update(
      { MaNguoiDung: user?.MaNguoiDung },
      {
        codeId: codeId,
        codeExpired: dayjs().add(5, 'minute').toDate(),
      },
    );

    this.mailerService.sendMail({
      to: user.Email,
      subject: 'Activate your account',
      template: 'register',
      context: {
        name: user?.HoTen ?? user?.Email,
        activationCode: codeId,
      },
    });
    return { MaNguoiDung: user?.MaNguoiDung };
  }

  async retryPassword(email: string) {
    const user = await this.nguoiDungRepository.findOne({
      where: {
        Email: email,
      },
    });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    const codeId = uuidv4();

    await this.nguoiDungRepository.update(
      { MaNguoiDung: user?.MaNguoiDung },
      {
        codeId: codeId,
        codeExpired: dayjs().add(5, 'minute').toDate(),
      },
    );

    this.mailerService.sendMail({
      to: user.Email,
      subject: 'Change your password account',
      template: 'register',
      context: {
        name: user?.HoTen ?? user?.Email,
        activationCode: codeId,
      },
    });
    return { MaNguoiDung: user?.MaNguoiDung, Email: user?.Email };
  }

  async changePassword(data: ChangePasswordAuthDto) {
    console.log(data);
    if (data?.confirmPassword !== data?.password) {
      throw new BadRequestException(
        'Mật khẩu/Xác nhận mật khẩu không chính xác',
      );
    }
    const user = await this.nguoiDungRepository.findOne({
      where: {
        Email: data?.email,
      },
    });

    console.log('kkk', user);

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(dayjs(user.codeExpired));
    console.log(user.codeExpired);
    if (isBeforeCheck) {
      const newPassword = await this.getHashPassword(data?.password);
      await this.nguoiDungRepository.update(
        { Email: data.email },
        { MatKhau: newPassword },
      );
      return { isBeforeCheck };
    } else {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn ');
    }
  }
}
