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
import { BsTextParagraph } from 'react-icons/bs';
import { Textarea } from '../ui/textarea';

const type: ElementsType = 'ParagraphField';

const extraAttributes = {
	text: 'Text here...',
};

const propertiesFormSchema = z.object({
	text: z.string().min(2).max(500),
});

type PropertiesFormSchemaType = z.infer<typeof propertiesFormSchema>;

export const ParagraphFieldFormElement: FormElement = {
	type,
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,
	designerButtonElement: {
		icon: BsTextParagraph,
		label: 'Paragraph Field',
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
	const { text } = element.extraAttributes;
	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label className='text-muted-foreground'>Paragraph Field</Label>
			<p>{text}</p>
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
			text: element.extraAttributes.text,
		},
	});

	useEffect(() => {
		form.reset(element.extraAttributes);
	}, [element, form]);

	function applyChanges(values: PropertiesFormSchemaType) {
		const { text } = values;
		updateElement(element.id, {
			...element,
			extraAttributes: {
				text,
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
					name='text'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Text</FormLabel>
							<FormControl>
								<Textarea
									rows={5}
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

	const { text } = element.extraAttributes;
	return <p>{text}</p>;
}
