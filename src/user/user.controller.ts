import {Body, Controller, Delete, Get, Param, Patch} from "@nestjs/common";
import {UserUpdateDto} from "./dto/user.dto";
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

	@Patch(":userId")
	async updateUser(@Param("userId") userId: string, @Body() dto: UserUpdateDto) {
		return await this.userService.updateUser(userId, dto);
	}

	@Delete(":userId")
	async deleteUser(@Param("userId") userId: string) {
		return await this.userService.deleteUser(userId);
	}
}
