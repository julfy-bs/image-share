import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsString, ValidateIf } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  _id: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;
  
  @Column({nullable: true})
  @IsString()
  @ValidateIf((object) => object.refreshToken !== null)
  refreshToken: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /* @OneToMany(() => Image, (image) => image.owner)
  images: Image[]; */
}
