import React from "react";
import { Flex } from "../../design/primitives/Flex";
import { Stack } from "../../design/primitives/Stack";
import { Body } from "../../design/typography/BasicText";
import { Heading } from "../../design/typography/Heading";
import { Loading } from "../../design/components/Loading";
import { Button } from "../../design/components/Button";
import { Icon } from "../../design/icons/Icon";

interface PageStateProps {
  status: "loading" | "empty" | "error" | "success";
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

/**
 * Universal Page State pattern.
 * Use this wrapper for any module page to handle the 4 core states.
 */
export function PageState({
  status,
  title,
  message,
  actionLabel,
  onAction,
  children,
}: PageStateProps) {
  if (status === "loading") {
    return (
      <Flex align="center" justify="center" className="h-full w-full min-h-[40vh]">
        <Stack space={4} align="center">
          <Loading size={32} />
          {message && <Body variant="secondary">{message}</Body>}
        </Stack>
      </Flex>
    );
  }

  if (status === "error") {
    return (
      <Flex align="center" justify="center" className="h-full w-full min-h-[40vh]">
        <Stack space={4} align="center" className="max-w-md text-center">
          <Icon name="AlertCircle" size={48} variant="error" />
          <Heading level={3}>{title || "An error occurred"}</Heading>
          <Body variant="secondary">{message || "We could not load this content."}</Body>
          {actionLabel && onAction && (
            <Button variant="secondary" onClick={onAction} className="mt-4">
              {actionLabel}
            </Button>
          )}
        </Stack>
      </Flex>
    );
  }

  if (status === "empty") {
    return (
      <Flex align="center" justify="center" className="h-full w-full min-h-[40vh]">
        <Stack space={4} align="center" className="max-w-md text-center">
          <Icon name="Inbox" size={48} variant="secondary" />
          <Heading level={3}>{title || "Nothing here yet"}</Heading>
          <Body variant="secondary">{message || "There is no content to display."}</Body>
          {actionLabel && onAction && (
            <Button variant="primary" onClick={onAction} className="mt-4">
              {actionLabel}
            </Button>
          )}
        </Stack>
      </Flex>
    );
  }

  // success
  return <>{children}</>;
}
