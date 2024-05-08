import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';


@Module({
    imports: [TypeOrmModule.forRoot({
        type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '',
          database: 'AUTHJWT',
          entities: [User],
          synchronize: false, // false means tabele will not change . if you make it true everytime when you restart all previous data will be delete
        //   logging: true,
      })]
})
export class DatabaseModule {}
