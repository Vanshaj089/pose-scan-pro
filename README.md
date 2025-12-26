# AI-Based Full Body Measurement Estimation (Approximate)

## Project Overview

This project presents an **AI-Based Full Body Measurement Estimation** system designed to approximate key human body dimensions from a set of three standard photographs. Leveraging advanced computer vision and deep learning models, the system processes images taken from specific angles to infer 3D body metrics, providing a fast and non-invasive solution for personal measurement.

The core objective is to achieve reasonable accuracy (targeting ~85%) in estimating critical body measurements, with a strong emphasis on the technical approach, scaling logic, and clear documentation of assumptions and limitations.

## Live Demo and API Access

The project is composed of a user-friendly web application and a robust backend API service.

| Component | Description | Link |
| :--- | :--- | :--- |
| **Web Application (Frontend)** | A working web-based demo allowing users to upload the required images and view the estimated measurements. | [https://pose-scan-pro.vercel.app/](https://pose-scan-pro.vercel.app/) |
| **Backend Service (Hugging Face Space)** | The deployed AI model and API service responsible for processing the images and calculating the measurements. | [https://huggingface.co/spaces/Vanshaj089/body-measurement-docker](https://huggingface.co/spaces/Vanshaj089/body-measurement-docker) |
| **API Documentation (Swagger UI)** | Interactive documentation for the backend API, detailing the `/measure_3pose` endpoint and data schemas. | [https://vanshaj089-body-measurement-docker.hf.space/docs](https://vanshaj089-body-measurement-docker.hf.space/docs) |

## Input Requirements

The system requires three specific images of the same person to perform the estimation:

1.  **Front View:** Person facing the camera directly.
2.  **Side View:** Person turned 90° (left or right) to the camera.
3.  **Standing Full Body:** Person standing with arms slightly apart.

## Mandatory Outputs

The AI model is engineered to provide the following approximate body measurements:

| Measurement Category | Specific Output |
| :--- | :--- |
| **Vertical Dimension** | Height |
| **Horizontal Dimensions** | Shoulder width |
| **Circumference/Girth** | Chest or Waist (at least one) |
| **Limb Lengths** | Hip, Arm length, Leg / Inseam length |

---

## Technical Deep Dive

The following sections detail the methodology and technical considerations underpinning the measurement estimation system.

### 1. Approach Used

The system employs a multi-stage computer vision pipeline to convert 2D image data into 3D body measurements.

*   **Pose Estimation and Keypoint Detection:** Initially, a deep learning model (e.g., OpenPose, MediaPipe, or a custom model) is used to detect and localize key anatomical landmarks (joints, torso points, etc.) in all three input images.
*   **3D Reconstruction/Triangulation:** The 2D keypoints from the Front and Side views are combined. By applying principles of **photogrammetry** and assuming a known camera model (or a simplified pinhole model), the 2D coordinates are triangulated to estimate the 3D coordinates of the keypoints in a real-world space.
*   **Measurement Calculation:** Once the 3D skeleton is reconstructed, the final body measurements are calculated by determining the Euclidean distances between the relevant 3D keypoints (e.g., distance between shoulder keypoints for shoulder width) or by inferring girths based on the estimated 3D shape and known body ratios.

### 2. Scaling Logic

A critical challenge in 2D-to-3D estimation is determining the real-world scale. The system addresses this using a combination of techniques:

*   **Reference Object/Known Dimension:** The most common approach is to use a known reference dimension. In this project, the system likely uses the estimated **Height** as the primary scaling factor. The distance between the floor and the top of the head (derived from the 3D keypoints) is assumed to correspond to the person's actual height (which may be an input or estimated separately).
*   **Pixel-to-Metric Conversion:** A ratio is established: `Scale Factor = Known Real-World Height / Estimated Pixel Height`. This factor is then applied uniformly to all other calculated 3D distances to convert them from arbitrary 3D units (e.g., meters or centimeters) to real-world metric units.
*   **Camera Calibration:** For higher accuracy, the system may incorporate a simplified camera calibration step, assuming the person is standing on a flat plane and the camera is at a known distance/angle, which helps normalize the perspective distortion.

### 3. Assumptions & Limitations

The accuracy of the system is directly tied to a set of underlying assumptions and inherent limitations of the technology.

#### Assumptions

| Category | Assumption | Impact on Accuracy |
| :--- | :--- | :--- |
| **Pose** | The subject maintains a standard, neutral pose (A-pose or T-pose) in all three images, with minimal clothing obstruction. | Deviations in pose directly affect keypoint localization and 3D triangulation accuracy. |
| **Camera** | The camera is positioned relatively level and perpendicular to the subject for the front and side views, minimizing lens distortion. | Significant perspective distortion (e.g., wide-angle lenses) will introduce measurement errors. |
| **Body Shape** | The system relies on established human body ratios to infer girth measurements (Chest, Waist, Hip) from 3D skeletal data. | Highly non-standard body shapes or extreme muscle mass may lead to less accurate girth estimations. |
| **Scaling** | The estimated or provided **Height** is accurate and serves as a reliable single-point reference for all other measurements. | Errors in the height reference propagate to all other calculated measurements. |

#### Limitations

*   **Occlusion and Clothing:** Loose or bulky clothing can obscure key joints and body contours, leading to inaccurate keypoint detection and poor girth estimation.
*   **Lighting and Background:** Poor lighting or cluttered backgrounds can confuse the pose estimation model, reducing overall reliability.
*   **Accuracy Threshold:** The target accuracy of ~85% is an approximation. The system is not a substitute for professional, manual measurement tools (e.g., tailor's tape) and should be used for general estimation purposes only.

## Accuracy and Justification

**Target Accuracy: ~85%**

The target accuracy of approximately 85% is considered **reasonable** for a 3D estimation system based on 2D images. This level of accuracy is justified by the following factors:

1.  **Inherent 2D-to-3D Ambiguity:** Converting 2D pixel data to a 3D model is an ill-posed problem. The system must infer depth and volume from flat images, which introduces unavoidable estimation error.
2.  **Dependence on Keypoint Accuracy:** The final measurement accuracy is capped by the precision of the initial keypoint detection. Even state-of-the-art pose estimation models have a margin of error, especially at limb extremities or obscured areas.
3.  **Girth Estimation:** Circumference measurements (Chest, Waist, Hip) are the most challenging, as they must be inferred from the distance between keypoints on the surface. This relies heavily on statistical models of human body shape, which accounts for the largest portion of the error margin.

The project prioritizes a robust **approach and explanation** over achieving perfect accuracy, acknowledging the real-world constraints of using standard photographic input.

## API Usage

The core functionality is exposed via a single API endpoint:

**Endpoint:** `POST /measure_3pose`

**Request Format:** `multipart/form-data`

| Field Name | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| `front` | File (binary) | The image file for the Front View. | Yes |
| `side` | File (binary) | The image file for the Side View. | Yes |
| `standing` | File (binary) | The image file for the Standing Full Body View. | Yes |

**Response Format:** `application/json` (HTTP 200)

The JSON response will contain the estimated measurements, such as:

```json
{
  "height_cm": 175.5,
  "shoulder_width_cm": 45.2,
  "chest_girth_cm": 98.0,
  "hip_girth_cm": 102.5,
  "arm_length_cm": 62.0,
  "inseam_length_cm": 80.5
}
```

## Installation (Local Development)

*(Placeholder for local setup instructions. Replace with actual steps for cloning, environment setup, and running the backend/frontend.)*

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPO_URL]
    cd [YOUR_REPO_NAME]
    ```
2.  **Backend Setup (Python/Docker):**
    ```bash
    # Example: Build and run the Docker container
    docker build -t body-measurement-api .
    docker run -p 8000:8000 body-measurement-api
    ```
3.  **Frontend Setup (Web App):**
    ```bash
    # Example: Install dependencies and run the React/Vite app
    cd frontend
    npm install
    npm run dev
    ```

## License

*(Placeholder for license information, e.g., MIT, Apache 2.0)*

This project is licensed under the [License Name] - see the [LICENSE.md](LICENSE.md) file for details.
