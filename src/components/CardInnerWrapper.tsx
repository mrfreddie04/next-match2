import React from 'react';
import { CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react';

type Props = {
  header: React.ReactNode | string,
  body: React.ReactNode
  footer?: React.ReactNode 
}  

export default function CardInnerWrapper({header, body, footer}: Props) {

  return (
    <>
      <CardHeader>
        {typeof (header) === "string" ? (
          <div className='text-2xl font-semibold text-secondary'>
            {header}
          </div>
        ) : (
          <>{header}</>
        )}
      </CardHeader>
      <Divider />
      <CardBody>
        {body}
      </CardBody>
      {footer && (
        <CardFooter>
          {footer}
        </CardFooter>
      )}
    </>
  );
}