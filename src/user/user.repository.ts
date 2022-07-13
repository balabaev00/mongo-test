import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {FilterQuery, Model} from "mongoose";
import {User, UserDocument} from "./schemas/user.schema";

@Injectable()
export class UserRepository {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	/**
	 * It returns a promise that resolves to a single user document that matches the filter query
	 * @param userFilterQuery - FilterQuery<User>
	 * @returns A promise that resolves to a single user document.
	 */
	async findOne(userFilterQuery: FilterQuery<User>) {
		return await this.userModel.findOne(userFilterQuery);
	}

	/**
	 * It returns a promise that resolves to an array of users that match the filter query
	 * @param usersFilterQuery - FilterQuery<User>
	 * @returns An array of users
	 */
	async find(usersFilterQuery: FilterQuery<User>) {
		return await this.userModel.find(usersFilterQuery);
	}

	/**
	 * It creates a new user in the database
	 * @param {User} user - User - This is the user object that we are passing in.
	 * @returns The user that was created.
	 */
	async create(user: User) {
		const newUser = new this.userModel(user);
		return await newUser.save();
	}

	/**
	 * It finds a user by a filter query and updates it with the new user object
	 * @param userFilterQuery - FilterQuery<User> - This is the filter query that will be used to find the
	 * user.
	 * @param user - The user object that you want to update.
	 * @returns The user that was updated.
	 */
	async findOneAndUpdate(userFilterQuery: FilterQuery<User>, user: Partial<User>) {
		return await this.userModel.findOneAndUpdate(userFilterQuery, user);
	}

	/**
	 * This function deletes a user from the database by filtering the user by the userId
	 * @param userFilterQuery - FilterQuery<User>
	 * @returns The deleted user
	 */
	async deleteUserByUserId(userFilterQuery: FilterQuery<User>) {
		return await this.userModel.findOneAndDelete(userFilterQuery);
	}
}
