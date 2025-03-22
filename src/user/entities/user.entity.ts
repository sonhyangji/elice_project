import { BaseEntity } from "src/common/base.entity";
import { AfterInsert, BeforeInsert, Column, Entity } from "typeorm";
import * as bcrypt from "bcryptjs"
import * as gravatar from "gravatar"
import { ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { InternalServerErrorException } from "@nestjs/common";
@Entity()
export class User extends  BaseEntity {
    @Column()
    public name: string;

    @Column({ unique: true })
    public email: string;

    @Column()
    public password: string;

    @Column({ nullable: true})
    public profileImg?: string;

    @BeforeInsert() // 생성전 실행되는 함수
    async beforeSaveFunc(): Promise<void>{
        if(this.password){
            const saltValue = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, saltValue);
        }
        //자동 디폴트 이미지 생성
        this.profileImg = gravatar.url(this.email, {
            s:'200',
            r:'png',
            d:'mm"',
            protocol:"http"
        })
    }

    async checkPassword( aPassword: string):Promise<boolean>{
        try {
            return await bcrypt.compare(aPassword,this.password);
        } catch (error) {
            throw new InternalServerErrorException
        }
    }
}