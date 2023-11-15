'use client';

import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RxDropdownMenu } from 'react-icons/rx';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { useToast } from '../ui/use-toast';

const type: ElementsType = 'SelectField';

const extraAttributes = {
    label: 'Select Field',
    helperText: 'Helper Text',
    required: false,
    placeholder: 'Value here...',
    options: [],
};

const propertiesFormSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
    placeholder: z.string().max(50),
    options: z.array(z.string()).default([]),
});

type PropertiesFormSchemaType = z.infer<typeof propertiesFormSchema>;

export const SelectFieldFormElement: FormElement = {
    type,
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    designerButtonElement: {
        icon: RxDropdownMenu,
        label: 'Select Field',
    },

    construct: (id: string) => ({
        id,
        type,
        extraAttributes,
    }),

    validate: (
        formElement: FormElementInstance,
        currentValue: string
    ): boolean => {
        const element = formElement as FormElementInstanceWithExtraAttributes;

        if (element.extraAttributes.required) {
            return currentValue.length > 0;
        }

        return true;
    },
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
    const { label, required, helperText, placeholder } =
        element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required ? '*' : ''}
            </Label>
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
            </Select>
            {helperText ? (
                <p className="text-muted-foreground text-sm">{helperText}</p>
            ) : null}
        </div>
    );
}

function PropertiesComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    const element = elementInstance as FormElementInstanceWithExtraAttributes;
    const { updateElement, setSelectedElement } = useDesigner();
    const { toast } = useToast();
    const form = useForm<PropertiesFormSchemaType>({
        resolver: zodResolver(propertiesFormSchema),
        mode: 'onSubmit',
        defaultValues: {
            label: element.extraAttributes.label,
            helperText: element.extraAttributes.helperText,
            required: element.extraAttributes.required,
            placeholder: element.extraAttributes.placeholder,
            options: element.extraAttributes.options,
        },
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    function applyChanges(values: PropertiesFormSchemaType) {
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                ...values,
            },
        });
        toast({
            title: 'Success',
            description: 'Properties saved successfully',
        });

        setSelectedElement(null);
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(applyChanges)}
                className="space-y-3"
            >
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter')
                                            e.currentTarget.blur();
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The label of the field. <br /> It will be
                                displayed above the field.
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="placeholder"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Placeholder</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter')
                                            e.currentTarget.blur();
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The placeholder for the field.
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="helperText"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Helper Text</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter')
                                            e.currentTarget.blur();
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The helper text of the field. <br /> It will be
                                displayed below the field.
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <Separator />
                <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Options</FormLabel>
                                <Button
                                    variant="outline"
                                    className="gap-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        form.setValue(
                                            'options',
                                            field.value.concat('New Option')
                                        );
                                    }}
                                >
                                    <AiOutlinePlus />
                                    Add
                                </Button>
                            </div>

                            <div className="flex flex-col gap-2">
                                {form.watch('options').map((option, index) => (
                                    <div
                                        className="flex items-center justify-between gap-1"
                                        key={index}
                                    >
                                        <Input
                                            placeholder=""
                                            value={option}
                                            onChange={(e) => {
                                                field.value[index] =
                                                    e.target.value;
                                                field.onChange(field.value);
                                            }}
                                        />
                                        <Button
                                            variant={'ghost'}
                                            size={'icon'}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const newOptions = [
                                                    ...field.value,
                                                ];
                                                newOptions.splice(index, 1);
                                                field.onChange(newOptions);
                                            }}
                                        >
                                            <AiOutlineClose />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <FormDescription>
                                The options that can be chosen.
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <Separator />
                <FormField
                    control={form.control}
                    name="required"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Required</FormLabel>
                                <FormDescription>
                                    If the field is required.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Separator />
                <Button
                    className="w-full"
                    type="submit"
                >
                    Save
                </Button>
            </form>
        </Form>
    );
}

function FormComponent({
    elementInstance,
    submitValue,
    isInvalid,
    defaultValue,
}: {
    elementInstance: FormElementInstance;
    submitValue?: SubmitFunction;
    isInvalid?: boolean;
    defaultValue?: string;
}) {
    const element = elementInstance as FormElementInstanceWithExtraAttributes;

    const [value, setValue] = useState(defaultValue || '');
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(isInvalid === true);
    }, [isInvalid]);

    const { label, required, helperText, placeholder, options } =
        element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className={cn(error && 'text-red-500')}>
                {label}
                {required ? '*' : ''}
            </Label>
            <Select
                value={defaultValue}
                onValueChange={(value) => {
                    setValue(value);
                    if (!submitValue) {
                        setValue('');
                        return;
                    }
                    const valid = SelectFieldFormElement.validate(
                        element,
                        value
                    );
                    setError(!valid);
                    submitValue(element.id, value);
                }}
            >
                <SelectTrigger
                    className={cn('w-full', error && 'border-red-500')}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem
                            key={option}
                            value={option}
                        >
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {helperText ? (
                <p
                    className={cn(
                        'text-muted-foreground text-sm',
                        error && 'text-red-500'
                    )}
                >
                    {helperText}
                </p>
            ) : null}
        </div>
    );
}
