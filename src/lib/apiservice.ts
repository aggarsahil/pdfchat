export async function uploadPDF(file: File): Promise<{ documentId: string }> {
  // --- Backend logic commented out ---
  // const formData = new FormData();
  // formData.append('file', file);

  // try {
  //   const response = await fetch('http://localhost:8000/upload', {
  //     method: 'POST',
  //     body: formData,
  //   });

  //   if (!response.ok) {
  //     throw new Error('Failed to upload PDF');
  //   }

  //   return response.json(); // Should return { documentId: string }
  // } catch (error) {
  //   // Fallback dummy response
  //   // console.warn('Backend unavailable, returning dummy documentId.');
  //   return { documentId: 'dummy-document-id' };
  // }

  // --- Dummy logic always used ---
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ documentId: 'dummy-document-id' });
    }, 1000);
  });
}

export async function askQuestion(documentId: string, question: string): Promise<{ answer: string }> {
  const dummyAnswers: Record<string, string> = {
    "What is the main topic of this document?": "The main topic of this document is an in-depth analysis of the subject matter discussed.",
    "Can you summarize the key points?": "The key points include a comprehensive overview, supporting data, and the final conclusions drawn by the authors.",
    "What are the conclusions?": "The document concludes that the findings support the initial hypothesis and suggest further research is needed.",
    "Who are the main authors mentioned?": "The main authors mentioned are Dr. Smith, Prof. Johnson, and Dr. Lee.",
    "What data or statistics are presented?": "The document presents several statistics, including a 25% increase over the last year and survey results from 500 participants."
  };

  const fallbackAnswers = [
    "This document provides valuable insights and detailed analysis on the topic.",
    "The authors have presented their arguments with supporting evidence throughout the document.",
    "Key findings are highlighted in the summary section towards the end.",
    "Several data points and case studies are discussed to support the conclusions.",
    "The document emphasizes the importance of continued research in this area."
  ];

  // --- Backend logic commented out ---
  // try {
  //   const response = await fetch('http://localhost:8000/ask', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ document_id: documentId, question }),
  //   });

  //   if (!response.ok) {
  //     throw new Error('Failed to get answer');
  //   }

  //   return response.json(); // Should return { answer: string }
  // } catch (error) {
  //   // Fallback: use mapped answer or random plausible answer
  //   const trimmedQuestion = question.trim();
  //   let answer = dummyAnswers[trimmedQuestion];
  //   if (!answer) {
  //     answer = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
  //   }
  //   // console.warn('Backend unavailable, returning dummy answer.');
  //   return { answer };
  // }

  // --- Dummy logic always used ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const trimmedQuestion = question.trim();
      let answer = dummyAnswers[trimmedQuestion];
      if (!answer) {
        answer = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
      }
      resolve({ answer });
    }, 1000);
  });
} 