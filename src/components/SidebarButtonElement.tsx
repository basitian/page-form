import React from 'react';
import { FormElement } from './FormElements';
import { Button } from './ui/button';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

const SidebarButtonElement = ({
	formElement,
}: {
	formElement: FormElement;
}) => {
	const { label, icon: Icon } = formElement.designerButtonElement;
	const draggable = useDraggable({
		id: `designer-btn-${formElement.type}`,
		data: {
			type: formElement.type,
			isDesignerBtnElement: true,
		},
	});

	return (
		<Button
			ref={draggable.setNodeRef}
			variant='outline'
			className={cn(
				'flex flex-col gap-2 w-[120px] h-[120px] cursor-grab',
				draggable.isDragging && 'ring-2 ring-primary'
			)}
			{...draggable.listeners}
			{...draggable.attributes}
		>
			<Icon className='h-8 w-8 text-primary cursor-grab' />
			<p className='text-xs'>{label}</p>
		</Button>
	);
};

export const SidebarButtonElementDragOverlay = ({
	formElement,
}: {
	formElement: FormElement;
}) => {
	const { label, icon: Icon } = formElement.designerButtonElement;

	return (
		<Button
			variant='outline'
			className='flex flex-col gap-2 w-[120px] h-[120px] cursor-grab'
		>
			<Icon className='h-8 w-8 text-primary cursor-grab' />
			<p className='text-xs'>{label}</p>
		</Button>
	);
};

export default SidebarButtonElement;
