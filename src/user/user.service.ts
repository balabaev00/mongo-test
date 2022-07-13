import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {v4 as uuidv4} from "uuid";
import {UserUpdateDto} from "./dto/user.dto";
import * as bcrypt from "bcrypt";

import {UserRepository} from "./user.repository";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	/**
	 * It returns a user object from the database, given a userId
	 * @param {string} userId - The userId of the user we want to find.
	 * @returns The user object
	 */
	async getUserById(userId: string) {
		return await this.userRepository.findOne({userId});
	}

	/**
	 * It returns a user object from the database, based on the email address passed in
	 * @param {string} email - string - This is the email of the user we want to find.
	 * @returns The user object
	 */
	async getUserByEmail(email: string) {
		return await this.userRepository.findOne({email});
	}

	/**
	 * It returns a promise that resolves to an array of users
	 * @returns An array of users
	 */
	async getUsers() {
		return await this.userRepository.find({});
	}

	/**
	 * It creates a new user in the database
	 * @param {string} email - string - the email of the user
	 * @param {string} password - string - the password that the user will use to log in.
	 * @param {number} age - number - the age of the user
	 * @returns User
	 */
	async createUser(email: string, password: string, age: number) {
		const oldUser = await this.userRepository.findOne({email});
		if (oldUser) return new HttpException(`Email is busy`, HttpStatus.BAD_REQUEST);

		return await this.userRepository.create({
			id: uuidv4(),
			email,
			password: bcrypt.hashSync(password, process.env.SALT),
			age,
		});
	}

	/**
	 * It finds a user by their userId and updates the user with the data in the dto
	 * @param {string} userId - The userId of the user to update.
	 * @param {UserUpdateDto} dto - This is the data transfer object that contains the data that will be
	 * used to update the user.
	 * @returns The updated user
	 */
	async updateUser(userId: string, dto: UserUpdateDto) {
		return await this.userRepository.findOneAndUpdate({userId}, dto);
	}
}
