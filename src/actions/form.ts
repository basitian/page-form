'use server';

import { FormElementInstance } from '@/components/FormElements';
import prisma from '@/lib/prisma';
import { FormSchemaType, formSchema } from '@/schemas/form';
import { currentUser } from '@clerk/nextjs';
import { Prisma } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';

class UserNotFoundError extends Error {}

export async function GetFormStats() {
	const user = await currentUser();
	if (!user) throw new UserNotFoundError();

	const stats = await prisma.form.aggregate({
		where: {
			userId: user.id,
		},
		_sum: {
			visits: true,
			submissions: true,
		},
	});

	const visits = stats._sum.visits || 0;
	const submissions = stats._sum.submissions || 0;

	let submissionRate = 0;
	if (visits > 0) {
		submissionRate = (submissions / visits) * 100;
	}

	const bounceRate = 100 - submissionRate;

	return {
		visits,
		submissions,
		submissionRate,
		bounceRate,
	};
}

export async function CreateForm(data: FormSchemaType) {
	const validation = formSchema.safeParse(data);
	if (!validation.success) throw new Error('Form not valid!');

	const user = await currentUser();
	if (!user) throw new UserNotFoundError();

	const { name, description } = data;

	const form = await prisma.form.create({
		data: {
			userId: user.id,
			name,
			description,
		},
	});

	if (!form) throw new Error('Something went wrong');

	return form.id;
}

export async function GetForms() {
	const user = await currentUser();
	if (!user) throw new UserNotFoundError();

	return await prisma.form.findMany({
		where: {
			userId: user.id,
		},
		orderBy: {
			createdAt: 'asc',
		},
	});
}

export async function GetFormById(id: number) {
	const user = await currentUser();
	if (!user) throw new UserNotFoundError();

	return await prisma.form.findUnique({
		where: {
			userId: user.id,
			id,
		},
	});
}

export async function GetFormContentByUrl(formUrl: string) {
	return await prisma.form.update({
		select: { content: true },
		data: {
			visits: {
				increment: 1,
			},
		},
		where: {
			shareUrl: formUrl,
		},
	});
}

export async function UpdateFormContent(
	id: number,
	content: FormElementInstance[]
) {
	const user = await currentUser();
	if (!user) throw new UserNotFoundError();

	return await prisma.form.update({
		where: {
			userId: user.id,
			id,
		},
		data: {
			content: content as Prisma.JsonArray,
		},
	});
}

export async function PublishForm(id: number) {
	const user = await currentUser();
	if (!user) throw new UserNotFoundError();

	return await prisma.form.update({
		where: {
			userId: user.id,
			id,
		},
		data: {
			published: true,
		},
	});
}

export async function SubmitForm(
	formUrl: string,
	content: Record<string, string>
) {
	return await prisma.form.update({
		data: {
			submissions: {
				increment: 1,
			},
			FormSubmissions: {
				create: {
					content: content as Prisma.JsonObject,
				},
			},
		},
		where: {
			shareUrl: formUrl,
			published: true,
		},
	});
}

export async function GetFormWithSubmissions(id: number) {
	const user = await currentUser();
	if (!user) throw new UserNotFoundError();

	return await prisma.form.findUnique({
		where: {
			id,
			userId: user.id,
		},
		include: {
			FormSubmissions: true,
		},
	});
}
