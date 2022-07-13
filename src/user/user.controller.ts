import {Body, Controller, Get, Param, Patch, Post} from "@nestjs/common";
import {UserCreateDto, UserUpdateDto} from "./dto/user.dto";
import {UserService} from "./user.service";

@Controller(`user`)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(":userId")
	async getUser(@Param("userId") userId: string) {
		return await this.userService.getUserById(userId);
	}

	@Get()
	async getUsers() {
		return await this.userService.getUsers();
	}

	@Post()
	async createUser(@Body() dto: UserCreateDto) {
		return await this.userService.createUser(dto.email, dto.password, dto.age);
	}

	@Patch(":userId")
	async updateUser(@Param("userId") userId: string, @Body() dto: UserUpdateDto) {
		return this.userService.updateUser(userId, dto);
	}
}
