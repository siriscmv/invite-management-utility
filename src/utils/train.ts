import type { LogisticRegressionClassifier } from 'natural';
import knowledgeBase from './knowledgeBase.js';

export default function train(classifier: LogisticRegressionClassifier) {
	for (const entry of knowledgeBase) {
		for (const q of entry[0]) {
			classifier.addDocument(q, entry[1]);
		}
	}

	classifier.train();
}
