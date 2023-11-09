'use client';

import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuHeading1 } from 'react-icons/lu';
import * as z from 'zod';
import {
	ElementsType,
	FormElement,
	FormElementInstance,
	SubmitFunction,
} from '../FormElements';
import useDesigner from '../hooks/useDesigner';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

const type: ElementsType = 'TitleField';

const extraAttributes = {
	title: 'Title Field',
};

const propertiesFormSchema = z.object({
	title: z.string().min(2).max(50),
});

type PropertiesFormSchemaType = z.infer<typeof propertiesFormSchema>;

export const TitleFieldFormElement: FormElement = {
	type,
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,
	designerButtonElement: {
		icon: LuHeading1,
		label: 'Title Field',
	},

	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),

	validate: () => true,
};

type FormElementInstanceWithExtraAttributes = FormElementInstance & {
	extraAttributes: typeof extraAttributes;
};

function DesignerComponent({
	elementInstance,
}: {
	elementInstance: FormElementInstance;
}) {
	const element = elementInstance as FormElementInstanceWithExtraAttributes;
	const { title } = element.extraAttributes;
	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label className='text-muted-foreground'>Title Field</Label>
			<p className='text-xl'>{title}</p>
		</div>
	);
}

function PropertiesComponent({
	elementInstance,
}: {
	elementInstance: FormElementInstance;
}) {
	const element = elementInstance as FormElementInstanceWithExtraAttributes;
	const { updateElement } = useDesigner();
	const form = useForm<PropertiesFormSchemaType>({
		resolver: zodResolver(propertiesFormSchema),
		mode: 'onBlur',
		defaultValues: {
			title: element.extraAttributes.title,
		},
	});

	useEffect(() => {
		form.reset(element.extraAttributes);
	}, [element, form]);

	function applyChanges(values: PropertiesFormSchemaType) {
		const { title } = values;
		updateElement(element.id, {
			...element,
			extraAttributes: {
				title,
			},
		});
	}
	return (
		<Form {...form}>
			<form
				onBlur={form.handleSubmit(applyChanges)}
				onSubmit={(e) => e.preventDefault()}
				className='space-y-3'
			>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === 'Enter') e.currentTarget.blur();
									}}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}

function FormComponent({
	elementInstance,
}: {
	elementInstance: FormElementInstance;
}) {
	const element = elementInstance as FormElementInstanceWithExtraAttributes;

	const { title } = element.extraAttributes;
	return <p className='text-xl'>{title}</p>;
}
