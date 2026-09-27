/**
 * Per-offer screening questions.
 *
 * The questionnaire is attached to a job by the HRIS, so its shape is entirely
 * server-driven and this component renders whatever arrives. Scoring fields
 * (option points, isEliminatory) never cross the API boundary, so nothing here
 * can leak them.
 *
 * NOTE: no offer in the development database carries a questionnaire, so this
 * has been written against the documented shape but not exercised against real
 * data. The server enforces required answers regardless of what this form does.
 */

import type { Questionnaire, QuestionnaireAnswer, QuestionnaireQuestion } from "@/api/types";
import { FieldError, REQUIRED_MARK_CLASS } from "@/components/FormField";
import { useT } from "@/i18n/LanguageContext";

/** questionId -> chosen option ids, or a typed value. */
export type AnswerState = Record<string, { optionIds: string[]; value: string }>;

export const emptyAnswers = (questionnaire: Questionnaire | null | undefined): AnswerState =>
  Object.fromEntries(
    (questionnaire?.questions ?? []).map((question) => [question.id, { optionIds: [], value: "" }]),
  );

const isMultiple = (question: QuestionnaireQuestion) =>
  question.options.length > 0 && /multi/i.test(question.type);

const isChoice = (question: QuestionnaireQuestion) => question.options.length > 0;

const isNumeric = (question: QuestionnaireQuestion) =>
  question.options.length === 0 && /number|numeric|int/i.test(question.type);

const isAnswered = (question: QuestionnaireQuestion, answer: AnswerState[string] | undefined) => {
  if (!answer) return false;
  return isChoice(question) ? answer.optionIds.length > 0 : answer.value.trim() !== "";
};

export const missingRequiredAnswers = (
  questionnaire: Questionnaire | null | undefined,
  answers: AnswerState,
): boolean =>
  (questionnaire?.questions ?? []).some(
    (question) => question.isRequired && !isAnswered(question, answers[question.id]),
  );

/** Only answered questions are sent; the server fills in the rest of the logic. */
export const toAnswerPayload = (
  questionnaire: Questionnaire | null | undefined,
  answers: AnswerState,
): QuestionnaireAnswer[] =>
  (questionnaire?.questions ?? [])
    .filter((question) => isAnswered(question, answers[question.id]))
    .map((question) => {
      const answer = answers[question.id];
      if (isChoice(question)) return { questionId: question.id, optionIds: answer.optionIds };
      if (isNumeric(question)) return { questionId: question.id, numericValue: Number(answer.value) };
      return { questionId: question.id, textValue: answer.value.trim() };
    });

const QuestionnaireFields = ({
  questionnaire,
  answers,
  onChange,
  error,
}: {
  questionnaire: Questionnaire | null;
  answers: AnswerState;
  onChange: (next: AnswerState) => void;
  error?: string;
}) => {
  const t = useT();
  if (!questionnaire?.questions?.length) return null;

  const questions = [...questionnaire.questions].sort((a, b) => a.ordinal - b.ordinal);

  const setChoice = (question: QuestionnaireQuestion, optionId: string) => {
    const current = answers[question.id] ?? { optionIds: [], value: "" };
    const optionIds = isMultiple(question)
      ? current.optionIds.includes(optionId)
        ? current.optionIds.filter((id) => id !== optionId)
        : [...current.optionIds, optionId]
      : [optionId];
    onChange({ ...answers, [question.id]: { ...current, optionIds } });
  };

  const setValue = (question: QuestionnaireQuestion, value: string) => {
    const current = answers[question.id] ?? { optionIds: [], value: "" };
    onChange({ ...answers, [question.id]: { ...current, value } });
  };

  return (
    <fieldset className="space-y-6 rounded-xl border border-border p-5">
      <legend className="px-2 font-heading text-lg font-semibold text-foreground">
        {t("Screening questions")}
      </legend>

      {questions.map((question) => {
        const answer = answers[question.id] ?? { optionIds: [], value: "" };
        const groupId = `q-${question.id}`;

        return (
          <div key={question.id}>
            {isChoice(question) ? (
              <fieldset>
                <legend className="mb-3 block text-sm font-semibold text-foreground">
                  {question.text}
                  {question.isRequired && (
                    <span aria-hidden="true" className={REQUIRED_MARK_CLASS}>{" *"}</span>
                  )}
                </legend>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-foreground"
                    >
                      <input
                        type={isMultiple(question) ? "checkbox" : "radio"}
                        name={groupId}
                        value={option.id}
                        checked={answer.optionIds.includes(option.id)}
                        onChange={() => setChoice(question, option.id)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <>
                <label htmlFor={groupId} className="mb-2 block text-sm font-semibold text-foreground">
                  {question.text}
                  {question.isRequired && (
                    <span aria-hidden="true" className={REQUIRED_MARK_CLASS}>{" *"}</span>
                  )}
                </label>
                <input
                  id={groupId}
                  type={isNumeric(question) ? "number" : "text"}
                  value={answer.value}
                  onChange={(e) => setValue(question, e.target.value)}
                  aria-required={question.isRequired || undefined}
                  className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground focus-visible:border-brand-edge"
                />
              </>
            )}
          </div>
        );
      })}

      <FieldError id="questionnaire-error" message={error} />
    </fieldset>
  );
};

export default QuestionnaireFields;
