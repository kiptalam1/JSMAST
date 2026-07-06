import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class RegisterDto {
  @IsEmail({}, { message: 'Please provide valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be atleast 3 characters' })
  @MaxLength(50, { message: 'Name cannot be 50 characters long' })
  name: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be atleast 8 characters' })
  password: string;
}
