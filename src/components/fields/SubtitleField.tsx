'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { LuHeading2 } from 'react-icons/lu';
import * as z from 'zod';
import {
	ElementsType,
	FormElement,
	FormElementInstance,
} from '../FormElements';
import useDesigner from '../hooks/useDesigner';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const type: ElementsType = 'SubtitleField';

const extraAttributes = {
	title: 'Subtitle Field',
};

const propertiesFormSchema = z.object({
	title: z.string().min(2).max(50),
});

type PropertiesFormSchemaType = z.infer<typeof propertiesFormSchema>;

export const SubtitleFieldFormElement: FormElement = {
	type,
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,
	designerButtonElement: {
		icon: LuHeading2,
		label: 'Subtitle Field',
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
			<Label className='text-muted-foreground'>Subtitle Field</Label>
			<p className='text-lg'>{title}</p>
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
	return <p className='text-lg'>{title}</p>;
}
